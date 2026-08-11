/**
 * O repositório não lança, devolve resultado: o compilador obriga quem chama a
 * tratar o caso ruim, e o que pode dar errado fica escrito no tipo em vez de
 * descoberto em produção.
 */

export type DataFailureKind =
  /** Rede, credencial inválida, projeto pausado. */
  | 'unreachable'
  /** Respondeu fora do contrato: coluna renomeada, tipo trocado. */
  | 'schema-mismatch'
  /** Violação de restrição — hoje, email duplicado. */
  | 'conflict'
  | 'unknown'

export type DataFailure = {
  kind: DataFailureKind
  /** Log do servidor, nunca a tela. */
  detail: string
}

export type DataResult<T> =
  | { ok: true; data: T }
  | { ok: false; failure: DataFailure }

export function dataFailure(kind: DataFailureKind, detail: string): DataResult<never> {
  return { ok: false, failure: { kind, detail } }
}
