import 'server-only'

import { describeFailure } from '@/features/leads/application/describe-failure'
import { leadRepository } from '@/features/leads/dependencies.server'
import type { LeadsResult } from '@/features/leads/types/results'

/** Falha de banco vira estado de tela, não 500: o painel segue navegável. */
export async function getLeads(): Promise<LeadsResult> {
  const result = await leadRepository.getAll()

  if (!result.ok) return describeFailure(result.failure, 'leads.getAll')

  return { ok: true, leads: result.data }
}
