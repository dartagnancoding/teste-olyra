import 'server-only'

import type { LeadRepository } from '@/features/leads/types/lead-repository'
import type { Lead } from '@/features/leads/types/lead'
import { getSupabase } from '@/lib/supabase/client'

const TABLE = 'leads'

/**
 * Implementação Supabase da porta `LeadRepository`. É o único arquivo da
 * feature que conhece a existência do Supabase — substituí-lo por um
 * `postgres-lead-repository.ts` é trocar a linha correspondente em
 * `features/leads/dependencies.ts`.
 */
export const supabaseLeadRepository: LeadRepository = {
  async getAll() {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)

    return (data ?? []) as Lead[]
  },

  async getById(id) {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw new Error(error.message)

    return (data as Lead | null) ?? null
  },

  async create(lead) {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .insert(lead)
      .select('*')
      .single()

    if (error) throw new Error(error.message)

    return data as Lead
  },

  async markWelcomeSent(id, sentAt) {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .update({ welcome_sent_at: sentAt.toISOString() })
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw new Error(error.message)

    return data as Lead
  },
}
