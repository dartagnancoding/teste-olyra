import 'server-only'

import { leadRepository } from '@/features/leads/dependencies.server'
import type { Lead } from '@/features/leads/types/lead'
import type { LeadInput } from '@/features/leads/types/lead-schema'

export type CreateLeadResult =
  | { ok: true; lead: Lead }
  | { ok: false; message: string }

export async function createLead(input: LeadInput): Promise<CreateLeadResult> {
  try {
    return { ok: true, lead: await leadRepository.create(input) }
  } catch (error) {
    console.error('[leads] falha ao cadastrar', error)

    return { ok: false, message: 'Não foi possível cadastrar o lead.' }
  }
}
