import type { PostgrestError } from '@supabase/supabase-js'

import type { DataFailureKind } from '@/features/leads/types/data-result'

/**
 * Tradução de erro do Postgres/PostgREST para o vocabulário da aplicação.
 *
 * Mora fora do repositório porque é lógica pura e é a parte mais fácil de
 * errar: um código mal classificado vira mensagem errada na tela, e isso não
 * aparece em nenhum teste de integração feliz.
 *
 * Os códigos foram verificados contra o projeto real, não deduzidos:
 *
 * - Postgres, classe 42: `42703` coluna inexistente, `42P01` tabela
 *   inexistente, `42804` tipo incompatível.
 * - PostgREST responde antes de tocar o Postgres quando o cache de schema já
 *   sabe que não existe: `PGRST205` (tabela), `PGRST204` (coluna).
 * - PostgREST, autenticação: `PGRST301` token expirado, `PGRST302` acesso
 *   anônimo negado, `PGRST303` token emitido no futuro (relógio fora de
 *   sincronia — apareceu de verdade, de forma intermitente, em desenvolvimento).
 */
const POSTGREST_SCHEMA_CODES = new Set(['PGRST204', 'PGRST205'])
const POSTGREST_AUTH_CODES = new Set(['PGRST301', 'PGRST302', 'PGRST303'])
const UNIQUE_VIOLATION = '23505'

export function classifyPostgrestError(error: PostgrestError): DataFailureKind {
  const code = error.code ?? ''

  if (code === UNIQUE_VIOLATION) return 'conflict'
  if (code.startsWith('42') || POSTGREST_SCHEMA_CODES.has(code)) return 'schema-mismatch'

  // Credencial recusada é o mesmo problema prático de banco inalcançável: o
  // operador precisa conferir chave, URL e relógio. Cair em "unknown" daria a
  // ele "erro inesperado, tente de novo", que não indica onde olhar.
  if (POSTGREST_AUTH_CODES.has(code)) return 'unreachable'

  // Sem código costuma ser transporte: DNS, TLS, projeto pausado, chave inválida.
  if (!code) return 'unreachable'

  return 'unknown'
}

/** Linha técnica para o log do servidor — nunca para a tela. */
export function describePostgrestError(error: PostgrestError): string {
  return [error.code, error.message, error.details, error.hint]
    .filter(Boolean)
    .join(' | ')
}
