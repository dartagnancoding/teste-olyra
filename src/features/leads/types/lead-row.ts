import { z } from 'zod'

/**
 * Contrato de **leitura** do banco — o formato que uma linha de `leads` precisa
 * ter para o resto do sistema poder confiar nela.
 *
 * Existe porque `select()` do Supabase devolve `any`: sem isto, um
 * `data as Lead[]` afirma um formato que ninguém conferiu, e uma coluna
 * renomeada vira `undefined` silencioso na interface em vez de erro.
 *
 * `origin` é `string` solto de propósito. Na escrita exigimos uma origem da
 * lista (`leadSchema`); na leitura aceitamos qualquer valor, porque o banco
 * pode guardar uma origem antiga que saiu da lista — e isso não pode derrubar
 * a tela.
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
