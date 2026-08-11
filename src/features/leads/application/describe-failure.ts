import 'server-only'

import type { DataFailure } from '@/features/leads/types/data-result'
import type { Failure, FailureCode } from '@/features/leads/types/results'

const MESSAGES: Record<DataFailure['kind'], { code: FailureCode; message: string }> = {
  unreachable: {
    code: 'DB_UNREACHABLE',
    message:
      'Não foi possível falar com o banco de dados. Verifique a conexão e as variáveis do Supabase, depois recarregue a página.',
  },
  'schema-mismatch': {
    code: 'DB_SCHEMA_MISMATCH',
    message:
      'O banco respondeu em um formato diferente do esperado. Normalmente é uma coluna renomeada ou removida — confira a tabela contra supabase/schema.sql.',
  },
  conflict: {
    code: 'DB_CONFLICT',
    message: 'Já existe um lead cadastrado com esse email.',
  },
  unknown: {
    code: 'DB_UNKNOWN',
    message: 'Erro inesperado ao falar com o banco de dados. Tente novamente.',
  },
}

/**
 * O `detail` cru do Postgres vai só para o log: ele carrega nome de coluna,
 * constraint e estrutura interna, que não têm por que chegar ao navegador.
 */
export function describeFailure(failure: DataFailure, context: string): Failure {
  const { code, message } = MESSAGES[failure.kind]

  console.error(`[${context}] ${code}: ${failure.detail}`)

  return { ok: false, code, message }
}
