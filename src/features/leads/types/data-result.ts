/**
 * Vocabulário de falha da camada de dados.
 *
 * O repositório **não lança**: devolve resultado. Assim o compilador obriga
 * quem chama a tratar o caso ruim, e a lista de coisas que podem dar errado
 * fica escrita no tipo em vez de descoberta em produção.
 */

export type DataFailureKind =
  /** Banco/serviço inalcançável: rede, credencial inválida, projeto pausado. */
  | 'unreachable'
  /** O banco respondeu, mas em formato diferente do contrato (coluna renomeada, tipo trocado). */
  | 'schema-mismatch'
  /** Violação de restrição — hoje, email duplicado. */
  | 'conflict'
  | 'unknown'

export type DataFailure = {
  kind: DataFailureKind
  /** Mensagem técnica. Vai para o log do servidor, nunca para a tela. */
  detail: string
}

export type DataResult<T> =
  | { ok: true; data: T }
  | { ok: false; failure: DataFailure }

export function dataFailure(kind: DataFailureKind, detail: string): DataResult<never> {
  return { ok: false, failure: { kind, detail } }
}
