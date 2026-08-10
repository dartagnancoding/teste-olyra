import type { Lead } from '@/features/leads/types/lead'

export const ALL_ORIGINS = 'todas'

export const SORTS = {
  recentes: 'Mais recentes',
  antigos: 'Mais antigos',
  nome: 'Nome (A–Z)',
  'nome-desc': 'Nome (Z–A)',
} as const

export type SortKey = keyof typeof SORTS

export const DEFAULT_SORT: SortKey = 'recentes'

export type LeadFilters = {
  query: string
  origin: string
  sort: SortKey
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

function byName(a: Lead, b: Lead): number {
  return a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
}

function byDate(a: Lead, b: Lead): number {
  return Date.parse(a.created_at) - Date.parse(b.created_at)
}

const COMPARATORS: Record<SortKey, (a: Lead, b: Lead) => number> = {
  recentes: (a, b) => byDate(b, a),
  antigos: byDate,
  nome: byName,
  'nome-desc': (a, b) => byName(b, a),
}

export function filterLeads(leads: Lead[], filters: LeadFilters): Lead[] {
  const query = normalize(filters.query.trim())

  const matching = leads.filter((lead) => {
    const matchesOrigin =
      filters.origin === ALL_ORIGINS || lead.origin === filters.origin

    if (!matchesOrigin) return false
    if (!query) return true

    return (
      normalize(lead.name).includes(query) || normalize(lead.email).includes(query)
    )
  })

  // `toSorted` em vez de `sort` para não reordenar a lista original — ela é o
  // estado do hook, e mutá-la faria o React não enxergar a mudança.
  return matching.toSorted(COMPARATORS[filters.sort] ?? COMPARATORS[DEFAULT_SORT])
}
