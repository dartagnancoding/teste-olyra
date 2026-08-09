import type { LeadInput } from '@/lib/validations'
import type { Lead } from '@/types/lead'

/**
 * Acesso do client às rotas de leads. Componentes chamam daqui e nunca montam
 * `fetch` no meio do JSX — trocar o transporte não toca a UI.
 */

async function readError(response: Response, fallback: string): Promise<string> {
  const data: unknown = await response.json().catch(() => null)

  return data && typeof data === 'object' && 'error' in data && data.error
    ? String(data.error)
    : fallback
}

export async function createLead(input: LeadInput): Promise<Lead> {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(await readError(response, 'Não foi possível cadastrar o lead.'))
  }

  const { lead } = (await response.json()) as { lead: Lead }

  return lead
}

export async function sendWelcome(leadId: string): Promise<Lead> {
  const response = await fetch('/api/send-welcome', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ leadId }),
  })

  if (!response.ok) {
    throw new Error(await readError(response, 'Não foi possível enviar o email.'))
  }

  const { lead } = (await response.json()) as { lead: Lead }

  return lead
}
