import type { Lead, NewLead } from '@/features/leads/types/lead'

/**
 * Contrato de persistência de leads. A UI e os route handlers dependem daqui,
 * nunca da implementação — trocar Supabase por outro banco é reescrever apenas
 * a implementação concreta em `lib/db/leads.ts`.
 */
export type LeadRepository = {
  getAll(): Promise<Lead[]>
  getById(id: string): Promise<Lead | null>
  create(data: NewLead): Promise<Lead>
  markWelcomeSent(id: string, sentAt: Date): Promise<Lead>
}
