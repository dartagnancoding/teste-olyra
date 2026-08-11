import 'server-only'

import type { ZodType } from 'zod'

import {
  classifyPostgrestError as classify,
  describePostgrestError as describe,
} from '@/features/leads/data/postgrest-errors'
import { dataFailure, type DataResult } from '@/features/leads/types/data-result'
import type { Lead } from '@/features/leads/types/lead'
import {
  LEAD_COLUMNS,
  leadRowSchema,
  leadRowsSchema,
} from '@/features/leads/types/lead-row'
import type { LeadRepository } from '@/features/leads/types/lead-repository'
import { getSupabase } from '@/lib/supabase/client'

const TABLE = 'leads'

/**
 * Ponto único onde a resposta do Supabase deixa de ser `any`. Sem este parse,
 * um `as Lead[]` afirmaria um formato que ninguém conferiu — foi exatamente
 * assim que uma coluna renomeada virou badge vazio em vez de erro.
 */
function parse<T>(schema: ZodType<T>, value: unknown, context: string): DataResult<T> {
  const parsed = schema.safeParse(value)

  if (parsed.success) return { ok: true, data: parsed.data }

  const issues = parsed.error.issues
    .map((issue) => `${issue.path.join('.') || '(raiz)'}: ${issue.message}`)
    .join('; ')

  return dataFailure(
    'schema-mismatch',
    `${context} devolveu formato inesperado — ${issues}`,
  )
}

/** Uma falha inesperada de transporte (o `fetch` explodiu) também vira valor. */
function fromThrown(error: unknown, context: string): DataResult<never> {
  return dataFailure(
    'unreachable',
    `${context} falhou: ${error instanceof Error ? error.message : String(error)}`,
  )
}

export const supabaseLeadRepository: LeadRepository = {
  async getAll() {
    try {
      const { data, error } = await getSupabase()
        .from(TABLE)
        .select(LEAD_COLUMNS)
        .order('created_at', { ascending: false })

      if (error) return dataFailure(classify(error), describe(error))

      return parse(leadRowsSchema, data ?? [], 'leads.getAll')
    } catch (error) {
      return fromThrown(error, 'leads.getAll')
    }
  },

  async getById(id) {
    try {
      const { data, error } = await getSupabase()
        .from(TABLE)
        .select(LEAD_COLUMNS)
        .eq('id', id)
        .maybeSingle()

      if (error) return dataFailure(classify(error), describe(error))
      if (!data) return { ok: true, data: null }

      const parsed = parse(leadRowSchema, data, 'leads.getById')

      return parsed.ok ? { ok: true, data: parsed.data as Lead | null } : parsed
    } catch (error) {
      return fromThrown(error, 'leads.getById')
    }
  },

  async create(lead) {
    try {
      const { data, error } = await getSupabase()
        .from(TABLE)
        .insert(lead)
        .select(LEAD_COLUMNS)
        .single()

      if (error) return dataFailure(classify(error), describe(error))

      return parse(leadRowSchema, data, 'leads.create')
    } catch (error) {
      return fromThrown(error, 'leads.create')
    }
  },

  async remove(id) {
    try {
      const { error } = await getSupabase().from(TABLE).delete().eq('id', id)

      if (error) return dataFailure(classify(error), describe(error))

      return { ok: true, data: undefined }
    } catch (error) {
      return fromThrown(error, 'leads.remove')
    }
  },

  async markWelcomeSent(id, sentAt) {
    try {
      const { data, error } = await getSupabase()
        .from(TABLE)
        .update({ welcome_sent_at: sentAt.toISOString() })
        .eq('id', id)
        .select(LEAD_COLUMNS)
        .single()

      if (error) return dataFailure(classify(error), describe(error))

      return parse(leadRowSchema, data, 'leads.markWelcomeSent')
    } catch (error) {
      return fromThrown(error, 'leads.markWelcomeSent')
    }
  },
}
