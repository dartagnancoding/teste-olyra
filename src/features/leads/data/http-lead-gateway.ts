import type { LeadGateway } from '@/features/leads/types/lead-gateway'
import type { Lead } from '@/features/leads/types/lead'

async function readError(response: Response, fallback: string): Promise<string> {
  const data: unknown = await response.json().catch(() => null)

  return data && typeof data === 'object' && 'error' in data && data.error
    ? String(data.error)
    : fallback
}

async function post(path: string, body: unknown, fallback: string): Promise<Lead> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) throw new Error(await readError(response, fallback))

  const { lead } = (await response.json()) as { lead: Lead }

  return lead
}

/** Implementação HTTP da porta `LeadGateway`. Roda no navegador. */
export const httpLeadGateway: LeadGateway = {
  create: (input) =>
    post('/api/leads', input, 'Não foi possível cadastrar o lead.'),

  sendWelcome: (leadId) =>
    post('/api/send-welcome', { leadId }, 'Não foi possível enviar o email.'),
}
