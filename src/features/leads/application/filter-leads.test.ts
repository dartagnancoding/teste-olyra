import { describe, expect, it } from 'vitest'

import {
  ALL_ORIGINS,
  DEFAULT_SORT,
  filterLeads,
  type LeadFilters,
} from '@/features/leads/application/filter-leads'
import type { Lead } from '@/features/leads/types/lead'

function lead(overrides: Partial<Lead> & Pick<Lead, 'name'>): Lead {
  return {
    id: '00000000-0000-4000-8000-000000000000',
    email: `${overrides.name.toLowerCase().replace(/\s/g, '.')}@exemplo.com`,
    origin: 'Site',
    welcome_sent_at: null,
    created_at: '2026-01-01T12:00:00.000Z',
    ...overrides,
  }
}

const ana = lead({
  name: 'Ana Conceição',
  origin: 'Indicação',
  created_at: '2026-01-03T12:00:00.000Z',
})
const bruno = lead({
  name: 'Bruno Lima',
  origin: 'Site',
  created_at: '2026-01-01T12:00:00.000Z',
})
const carla = lead({
  name: 'Carla Ötker',
  email: 'carla@empresa.com.br',
  origin: 'Instagram',
  created_at: '2026-01-02T12:00:00.000Z',
})

const leads = [ana, bruno, carla]

function filters(overrides: Partial<LeadFilters> = {}): LeadFilters {
  return { query: '', origin: ALL_ORIGINS, sort: DEFAULT_SORT, ...overrides }
}

function names(result: Lead[]): string[] {
  return result.map((item) => item.name)
}

describe('filtro por origem', () => {
  it('devolve tudo quando a origem é "todas"', () => {
    expect(filterLeads(leads, filters())).toHaveLength(3)
  })

  it('restringe a uma origem', () => {
    expect(names(filterLeads(leads, filters({ origin: 'Instagram' })))).toEqual([
      'Carla Ötker',
    ])
  })

  it('devolve lista vazia para origem sem lead', () => {
    expect(filterLeads(leads, filters({ origin: 'Feira' }))).toEqual([])
  })
})

describe('busca', () => {
  it('ignora acento na consulta e no dado', () => {
    // O caso que motiva a normalização: quem digita "conceicao" no celular,
    // sem acento, precisa achar "Ana Conceição".
    expect(names(filterLeads(leads, filters({ query: 'conceicao' })))).toEqual([
      'Ana Conceição',
    ])
    expect(names(filterLeads(leads, filters({ query: 'Ötker' })))).toEqual(['Carla Ötker'])
    expect(names(filterLeads(leads, filters({ query: 'otker' })))).toEqual(['Carla Ötker'])
  })

  it('ignora maiúsculas e espaço em volta', () => {
    expect(names(filterLeads(leads, filters({ query: '  BRUNO  ' })))).toEqual([
      'Bruno Lima',
    ])
  })

  it('busca também por email', () => {
    expect(names(filterLeads(leads, filters({ query: 'empresa.com' })))).toEqual([
      'Carla Ötker',
    ])
  })

  it('combina busca e origem — as duas precisam bater', () => {
    expect(filterLeads(leads, filters({ query: 'bruno', origin: 'Instagram' }))).toEqual(
      [],
    )
  })
})

describe('ordenação', () => {
  it('mais recentes primeiro por padrão', () => {
    expect(names(filterLeads(leads, filters()))).toEqual([
      'Ana Conceição',
      'Carla Ötker',
      'Bruno Lima',
    ])
  })

  it('mais antigos primeiro', () => {
    expect(names(filterLeads(leads, filters({ sort: 'antigos' })))).toEqual([
      'Bruno Lima',
      'Carla Ötker',
      'Ana Conceição',
    ])
  })

  it('alfabética respeita acento como se não existisse', () => {
    expect(names(filterLeads(leads, filters({ sort: 'nome' })))).toEqual([
      'Ana Conceição',
      'Bruno Lima',
      'Carla Ötker',
    ])
  })

  it('alfabética invertida', () => {
    expect(names(filterLeads(leads, filters({ sort: 'nome-desc' })))).toEqual([
      'Carla Ötker',
      'Bruno Lima',
      'Ana Conceição',
    ])
  })

  it('não reordena a lista original', () => {
    // A lista é o estado do hook. Ordenar no lugar faria o React não enxergar
    // a mudança — por isso `toSorted`, e por isso este teste.
    const original = [...leads]

    filterLeads(leads, filters({ sort: 'nome-desc' }))

    expect(leads).toEqual(original)
  })
})
