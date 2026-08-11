import type { PostgrestError } from '@supabase/supabase-js'
import { describe, expect, it } from 'vitest'

import {
  classifyPostgrestError,
  describePostgrestError,
} from '@/features/leads/data/postgrest-errors'

function error(overrides: Partial<PostgrestError> = {}): PostgrestError {
  return {
    name: 'PostgrestError',
    code: '',
    message: '',
    details: '',
    hint: '',
    ...overrides,
  } as PostgrestError
}

describe('classificação de erro', () => {
  it('violação de unicidade vira conflito', () => {
    expect(classifyPostgrestError(error({ code: '23505' }))).toBe('conflict')
  })

  it.each([
    ['42703', 'coluna inexistente'],
    ['42P01', 'tabela inexistente'],
    ['42804', 'tipo incompatível'],
  ])('classe 42 (%s, %s) vira schema-mismatch', (code) => {
    expect(classifyPostgrestError(error({ code }))).toBe('schema-mismatch')
  })

  it.each([
    ['PGRST204', 'coluna'],
    ['PGRST205', 'tabela'],
  ])('cache de schema do PostgREST (%s, %s) vira schema-mismatch', (code) => {
    // Verificado contra o projeto real: quando o cache do PostgREST já sabe que
    // não existe, ele responde antes de tocar o Postgres — e o código não é da
    // classe 42. Sem esta linha, uma tabela ausente cairia em "unknown".
    expect(classifyPostgrestError(error({ code }))).toBe('schema-mismatch')
  })

  it.each([[''], [undefined]])('erro sem código (%s) vira inalcançável', (code) => {
    expect(classifyPostgrestError(error({ code }))).toBe('unreachable')
  })

  it('código desconhecido não é chutado para outra categoria', () => {
    expect(classifyPostgrestError(error({ code: '22P02' }))).toBe('unknown')
  })
})

describe('descrição técnica', () => {
  it('junta os campos preenchidos, na ordem de leitura', () => {
    const detail = describePostgrestError(
      error({
        code: '42703',
        message: 'column leads.origem does not exist',
        hint: 'Perhaps you meant to reference the column "leads.origin"',
      }),
    )

    expect(detail).toBe(
      '42703 | column leads.origem does not exist | Perhaps you meant to reference the column "leads.origin"',
    )
  })

  it('não deixa separador solto quando falta campo', () => {
    expect(describePostgrestError(error({ message: 'fetch failed' }))).toBe('fetch failed')
  })
})
