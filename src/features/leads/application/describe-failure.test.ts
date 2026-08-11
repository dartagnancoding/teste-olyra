import { afterEach, describe, expect, it, vi } from 'vitest'

import { describeFailure } from '@/features/leads/application/describe-failure'
import type { DataFailure, DataFailureKind } from '@/features/leads/types/data-result'

function failure(kind: DataFailureKind, detail = 'detalhe técnico'): DataFailure {
  return { kind, detail }
}

afterEach(() => {
  vi.restoreAllMocks()
})

function silenceLog() {
  return vi.spyOn(console, 'error').mockImplementation(() => {})
}

describe('tradução de falha em mensagem de tela', () => {
  it.each([
    ['unreachable', 'DB_UNREACHABLE'],
    ['schema-mismatch', 'DB_SCHEMA_MISMATCH'],
    ['conflict', 'DB_CONFLICT'],
    ['unknown', 'DB_UNKNOWN'],
  ] as const)('%s vira %s', (kind, code) => {
    silenceLog()

    const result = describeFailure(failure(kind), 'leads.getAll')

    expect(result.ok).toBe(false)
    expect(result.code).toBe(code)
    expect(result.message.length).toBeGreaterThan(0)
  })

  it('nunca coloca o detalhe técnico na mensagem da tela', () => {
    // O detalhe cru do Postgres carrega nome de coluna, constraint e hint. Isso
    // é ótimo no log e é vazamento de estrutura interna no navegador.
    silenceLog()

    const detail = '42703 | column leads.origem does not exist'
    const result = describeFailure(failure('schema-mismatch', detail), 'leads.getAll')

    expect(result.message).not.toContain(detail)
    expect(result.message).not.toContain('42703')
    expect(result.message).not.toContain('leads.origem')
  })

  it('manda o detalhe para o log do servidor, com contexto e código', () => {
    const log = silenceLog()

    describeFailure(failure('unreachable', 'fetch failed'), 'leads.create')

    expect(log).toHaveBeenCalledTimes(1)
    expect(log.mock.calls[0]?.[0]).toBe('[leads.create] DB_UNREACHABLE: fetch failed')
  })
})
