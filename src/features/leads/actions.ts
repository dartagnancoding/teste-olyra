'use server'

import { isAuthenticated } from '@/features/auth/application/session'
import { createLead } from '@/features/leads/application/create-lead'
import { sendWelcome } from '@/features/leads/application/send-welcome'
import { leadSchema, sendWelcomeSchema } from '@/features/leads/types/lead-schema'
import type { LeadResult } from '@/features/leads/types/results'

/**
 * Adaptador de entrada da feature — ocupa o lugar que os route handlers
 * ocupavam. Autentica, valida e delega; nenhuma regra vive aqui.
 *
 * Server Action é endpoint público: qualquer um pode invocá-la sem passar pela
 * UI. Por isso a checagem de sessão e o parse com Zod continuam obrigatórios,
 * exatamente como eram na rota.
 */
export async function createLeadAction(input: unknown): Promise<LeadResult> {
  if (!(await isAuthenticated())) {
    return { ok: false, message: 'Sessão expirada. Entre novamente.' }
  }

  const parsed = leadSchema.safeParse(input)

  if (!parsed.success) return { ok: false, message: 'Dados inválidos.' }

  return createLead(parsed.data)
}

export async function sendWelcomeAction(leadId: unknown): Promise<LeadResult> {
  if (!(await isAuthenticated())) {
    return { ok: false, message: 'Sessão expirada. Entre novamente.' }
  }

  const parsed = sendWelcomeSchema.safeParse({ leadId })

  if (!parsed.success) return { ok: false, message: 'Lead inválido.' }

  return sendWelcome(parsed.data.leadId)
}
