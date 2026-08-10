import 'server-only'

import { describeFailure } from '@/features/leads/application/describe-failure'
import { leadRepository } from '@/features/leads/dependencies.server'
import type { LeadInput } from '@/features/leads/types/lead-schema'
import type { LeadResult } from '@/features/leads/types/results'

export async function createLead(input: LeadInput): Promise<LeadResult> {
  const result = await leadRepository.create(input)

  if (!result.ok) return describeFailure(result.failure, 'leads.create')

  return { ok: true, lead: result.data }
}
