import type { Lead } from '@/features/leads/types/lead'

/**
 * Falha esperada é valor de retorno, não exceção — o componente faz `if`, não
 * `try/catch`.
 *
 * O `code` aparece na UI e no log: o operador diz "deu DB_SCHEMA_MISMATCH" e
 * quem investiga acha a linha sem adivinhar.
 */
export type FailureCode =
  | 'DB_UNREACHABLE'
  | 'DB_SCHEMA_MISMATCH'
  | 'DB_CONFLICT'
  | 'DB_UNKNOWN'
  | 'MAIL_REJECTED'
  | 'NOT_FOUND'
  | 'UNAUTHENTICATED'
  | 'INVALID_INPUT'

export type Failure = {
  ok: false
  /** Pronto para a tela: português, sem jargão. */
  message: string
  code: FailureCode
}

export type LeadsResult = { ok: true; leads: Lead[] } | Failure

export type LeadResult = { ok: true; lead: Lead } | Failure

export type VoidResult = { ok: true } | Failure
