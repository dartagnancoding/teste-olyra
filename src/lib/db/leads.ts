import 'server-only'

import { getDb } from '@/lib/db/client'
import type { LeadRepository } from '@/lib/db/types'
import type { Lead } from '@/types/lead'

const TABLE = 'leads'

export const leadRepository: LeadRepository = {
  async getAll() {
    const { data, error } = await getDb()
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)

    return (data ?? []) as Lead[]
  },

  async getById(id) {
    const { data, error } = await getDb()
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw new Error(error.message)

    return (data as Lead | null) ?? null
  },

  async create(lead) {
    const { data, error } = await getDb().from(TABLE).insert(lead).select('*').single()

    if (error) throw new Error(error.message)

    return data as Lead
  },

  async markWelcomeSent(id, sentAt) {
    const { data, error } = await getDb()
      .from(TABLE)
      .update({ welcome_sent_at: sentAt.toISOString() })
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw new Error(error.message)

    return data as Lead
  },
}
