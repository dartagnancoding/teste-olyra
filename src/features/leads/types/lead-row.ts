import { z } from 'zod'

/**
 * `select()` do Supabase devolve `any`: sem este parse, um `data as Lead[]`
 * afirma um formato que ninguém conferiu, e uma coluna renomeada vira
 * `undefined` silencioso na tela em vez de erro.
 *
 * `origin` fica `string` solto: na escrita exigimos uma da lista, mas o banco
 * pode guardar uma origem antiga que saiu dela, e isso não pode derrubar a tela.
 */
export const leadRowSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.string(),
  origin: z.string(),
  welcome_sent_at: z.string().nullable(),
  created_at: z.string(),
})

export const leadRowsSchema = z.array(leadRowSchema)

/** Colunas pedidas explicitamente: se uma sumir, o Postgres acusa na hora. */
export const LEAD_COLUMNS = 'id, name, email, origin, welcome_sent_at, created_at'
