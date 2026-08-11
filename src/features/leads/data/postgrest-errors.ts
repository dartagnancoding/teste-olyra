import type { PostgrestError } from '@supabase/supabase-js'

import type { DataFailureKind } from '@/features/leads/types/data-result'

/**
 * Um código mal classificado vira mensagem errada na tela, e nenhum teste de
 * integração feliz pega isso — daí morar fora do repositório, como lógica pura.
 *
 * Classe 42 é schema no Postgres; PGRST204/205 é o mesmo, respondido pelo cache
 * do PostgREST antes de tocar o banco. PGRST301/302/303 são autenticação — o
 * 303 (token emitido no futuro, relógio dessincronizado) apareceu de verdade,
 * intermitente, em desenvolvimento.
 */
const POSTGREST_SCHEMA_CODES = new Set(['PGRST204', 'PGRST205'])
const POSTGREST_AUTH_CODES = new Set(['PGRST301', 'PGRST302', 'PGRST303'])
const UNIQUE_VIOLATION = '23505'

export function classifyPostgrestError(error: PostgrestError): DataFailureKind {
  const code = error.code ?? ''

  if (code === UNIQUE_VIOLATION) return 'conflict'
  if (code.startsWith('42') || POSTGREST_SCHEMA_CODES.has(code)) return 'schema-mismatch'

  // Credencial recusada é o mesmo problema prático de banco inalcançável:
  // conferir chave, URL e relógio. "unknown" só diria "tente de novo".
  if (POSTGREST_AUTH_CODES.has(code)) return 'unreachable'

  // Sem código costuma ser transporte: DNS, TLS, projeto pausado.
  if (!code) return 'unreachable'

  return 'unknown'
}

/** Linha técnica para o log do servidor — nunca para a tela. */
export function describePostgrestError(error: PostgrestError): string {
  return [error.code, error.message, error.details, error.hint]
    .filter(Boolean)
    .join(' | ')
}
