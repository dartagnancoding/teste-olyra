import 'server-only'

import { describeFailure } from '@/features/leads/application/describe-failure'
import { leadRepository } from '@/features/leads/dependencies.server'
import type { VoidResult } from '@/features/leads/types/results'

/**
 * Exclusão é definitiva — não há lixeira nem `deleted_at`. A confirmação vive
 * na interface; aqui a única regra é traduzir a falha do banco.
 */
export async function deleteLead(id: string): Promise<VoidResult> {
  const result = await leadRepository.remove(id)

  if (!result.ok) return describeFailure(result.failure, 'leads.remove')

  return { ok: true }
}
