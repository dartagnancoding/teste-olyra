import { describe, expect, it } from 'vitest'

import { LEAD_COLUMNS, leadRowSchema, leadRowsSchema } from '@/features/leads/types/lead-row'

const row = {
  id: '3f2504e0-4f89-41d3-9a0c-0305e82c3301',
  name: 'Mariana Costa',
  email: 'mariana.costa@exemplo.com',
  origin: 'Instagram',
  welcome_sent_at: null,
  created_at: '2026-01-01T12:00:00.000Z',
}

describe('contrato de leitura', () => {
  it('aceita uma linha válida', () => {
    expect(leadRowSchema.parse(row)).toEqual(row)
  })

  it('aceita welcome_sent_at preenchido', () => {
    const sent = { ...row, welcome_sent_at: '2026-01-02T09:30:00.000Z' }

    expect(leadRowSchema.parse(sent)).toEqual(sent)
  })

  it('recusa a linha quando uma coluna é renomeada', () => {
    // Regressão do bug real: a coluna `origem` não tinha sido renomeada para
    // `origin` no banco. `tsc`, `eslint` e `build` passaram verdes porque
    // `select()` devolve `any`, e o badge de origem apareceu vazio na tela em
    // vez de dar erro. Este parse é o que transforma isso em falha nomeada.
    const { origin: _origin, ...semOrigin } = row

    expect(leadRowSchema.safeParse({ ...semOrigin, origem: 'Instagram' }).success).toBe(
      false,
    )
  })

  it('recusa id que não é uuid', () => {
    expect(leadRowSchema.safeParse({ ...row, id: '42' }).success).toBe(false)
  })

  it('recusa welcome_sent_at ausente — null e indefinido não são a mesma coisa', () => {
    const { welcome_sent_at: _sent, ...semData } = row

    expect(leadRowSchema.safeParse(semData).success).toBe(false)
  })

  it('aceita uma origem fora da lista de escrita', () => {
    // De propósito: o banco pode guardar uma origem antiga que saiu do enum, e
    // isso não pode derrubar a listagem.
    expect(leadRowSchema.safeParse({ ...row, origin: 'Panfleto de 2019' }).success).toBe(
      true,
    )
  })

  it('valida listas, inclusive a vazia', () => {
    expect(leadRowsSchema.parse([])).toEqual([])
    expect(leadRowsSchema.parse([row])).toHaveLength(1)
  })
})

describe('colunas pedidas ao banco', () => {
  it('pede exatamente o que o schema exige', () => {
    // Invariante fácil de quebrar: alguém acrescenta um campo ao schema e
    // esquece do `select`. O Postgres devolveria a linha sem ele e o parse
    // acusaria "formato inesperado" sem dizer que a culpa é do select.
    const pedidas = LEAD_COLUMNS.split(',').map((column) => column.trim())

    expect(pedidas.toSorted()).toEqual(Object.keys(leadRowSchema.shape).toSorted())
  })
})
