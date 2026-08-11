import type { DataResult } from '@/features/leads/types/data-result'
import type { Lead, NewLead } from '@/features/leads/types/lead'

/**
 * Nenhum método lança: todo erro é `DataResult`, então as falhas possíveis
 * fazem parte da assinatura.
 */
export type LeadRepository = {
  getAll(): Promise<DataResult<Lead[]>>
  /** `data: null` é "não existe"; falha vem em `failure`. */
  getById(id: string): Promise<DataResult<Lead | null>>
  create(lead: NewLead): Promise<DataResult<Lead>>
  markWelcomeSent(id: string, sentAt: Date): Promise<DataResult<Lead>>
  remove(id: string): Promise<DataResult<void>>
}
