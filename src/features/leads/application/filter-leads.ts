import type { Lead } from '@/features/leads/types/lead'

export const ALL_ORIGINS = 'todas'

export type LeadFilters = {
  query: string
  origin: string
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

export function filterLeads(leads: Lead[], filters: LeadFilters): Lead[] {
  const query = normalize(filters.query.trim())

  return leads.filter((lead) => {
    const matchesOrigin =
      filters.origin === ALL_ORIGINS || lead.origin === filters.origin

    if (!matchesOrigin) return false
    if (!query) return true

    return (
      normalize(lead.name).includes(query) || normalize(lead.email).includes(query)
    )
  })
}

export function countByOrigin(leads: Lead[]): Array<{ origin: string; total: number }> {
  const counts = new Map<string, number>()

  for (const lead of leads) {
    counts.set(lead.origin, (counts.get(lead.origin) ?? 0) + 1)
  }

  return [...counts.entries()]
    .map(([origin, total]) => ({ origin, total }))
    .sort((a, b) => b.total - a.total || a.origin.localeCompare(b.origin, 'pt-BR'))
}
