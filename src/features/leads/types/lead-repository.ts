import type { DataResult } from '@/features/leads/types/data-result'
import type { Lead, NewLead } from '@/features/leads/types/lead'

/**
 * Contrato de persistência de leads. A application depende daqui, nunca da
 * implementação — trocar Supabase por outro banco é reescrever apenas a
 * implementação concreta em `data/`.
 *
 * Nenhum método lança: todo caminho de erro é `DataResult`, então a lista de
 * falhas possíveis faz parte da assinatura.
 */
export type LeadRepository = {
  getAll(): Promise<DataResult<Lead[]>>
  /** `data: null` é "não existe" — diferente de falha, que vem em `failure`. */
  getById(id: string): Promise<DataResult<Lead | null>>
  create(lead: NewLead): Promise<DataResult<Lead>>
  markWelcomeSent(id: string, sentAt: Date): Promise<DataResult<Lead>>
}
