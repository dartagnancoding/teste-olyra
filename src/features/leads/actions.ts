'use server'

import { isAuthenticated } from '@/features/auth/application/session'
import { createLead } from '@/features/leads/application/create-lead'
import { deleteLead } from '@/features/leads/application/delete-lead'
import { sendWelcome } from '@/features/leads/application/send-welcome'
import { leadSchema, sendWelcomeSchema } from '@/features/leads/types/lead-schema'
import type { LeadResult, VoidResult } from '@/features/leads/types/results'

/**
 * Server Action é endpoint público: dá para invocar sem passar pela UI. Por
 * isso a checagem de sessão e o parse com Zod são obrigatórios aqui.
 */
export async function createLeadAction(input: unknown): Promise<LeadResult> {
  if (!(await isAuthenticated())) {
    return { ok: false, code: 'UNAUTHENTICATED', message: 'Sessão expirada. Entre novamente.' }
  }

  const parsed = leadSchema.safeParse(input)

  if (!parsed.success) {
    const first = parsed.error.issues.at(0)

    return {
      ok: false,
      code: 'INVALID_INPUT',
      message: first ? first.message : 'Dados inválidos.',
    }
  }

  return createLead(parsed.data)
}

export async function sendWelcomeAction(leadId: unknown): Promise<LeadResult> {
  if (!(await isAuthenticated())) {
    return { ok: false, code: 'UNAUTHENTICATED', message: 'Sessão expirada. Entre novamente.' }
  }

  const parsed = sendWelcomeSchema.safeParse({ leadId })

  if (!parsed.success) {
    return { ok: false, code: 'INVALID_INPUT', message: 'Lead inválido.' }
  }

  return sendWelcome(parsed.data.leadId)
}

export async function deleteLeadAction(leadId: unknown): Promise<VoidResult> {
  if (!(await isAuthenticated())) {
    return { ok: false, code: 'UNAUTHENTICATED', message: 'Sessão expirada. Entre novamente.' }
  }

  const parsed = sendWelcomeSchema.safeParse({ leadId })

  if (!parsed.success) {
    return { ok: false, code: 'INVALID_INPUT', message: 'Lead inválido.' }
  }

  return deleteLead(parsed.data.leadId)
}
