import 'server-only'

import { leadRepository } from '@/features/leads/dependencies.server'
import type { LeadInput } from '@/features/leads/types/lead-schema'
import type { LeadResult } from '@/features/leads/types/results'

export async function createLead(input: LeadInput): Promise<LeadResult> {
  try {
    return { ok: true, lead: await leadRepository.create(input) }
  } catch (error) {
    console.error('[leads] falha ao cadastrar', error)

    return { ok: false, message: 'Não foi possível cadastrar o lead.' }
  }
}
