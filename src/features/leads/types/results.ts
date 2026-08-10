import type { Lead } from '@/features/leads/types/lead'

/**
 * Resultados dos casos de uso. Vivem em `types` porque atravessam a fronteira
 * servidor→client: a action devolve, o componente consome. Como são tipos puros
 * (apagados na compilação), o client nunca arrasta o módulo de servidor junto.
 *
 * Falha esperada é valor de retorno, não exceção — o componente faz `if`, não
 * `try/catch`.
 *
 * `code` é estável e curto de propósito: aparece discretamente na UI e no log
 * do servidor, então o operador consegue dizer "deu DB_SCHEMA_MISMATCH" e quem
 * for investigar acha a linha correspondente sem adivinhar.
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
  /** Texto pronto para a tela, em português e sem jargão. */
  message: string
  code: FailureCode
}

export type LeadsResult = { ok: true; leads: Lead[] } | Failure

export type LeadResult = { ok: true; lead: Lead } | Failure

export type VoidResult = { ok: true } | Failure
