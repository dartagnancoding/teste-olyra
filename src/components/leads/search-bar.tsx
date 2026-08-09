'use client'

import { useId } from 'react'

import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { ALL_ORIGINS, type LeadFilters } from '@/lib/leads/filter-leads'
import { ORIGINS } from '@/types/lead'

type SearchBarProps = {
  filters: LeadFilters
  onChange: (filters: LeadFilters) => void
}

export function SearchBar({ filters, onChange }: SearchBarProps) {
  const queryId = useId()
  const originId = useId()

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex-1">
        <label htmlFor={queryId} className="sr-only">
          Buscar por nome ou email
        </label>
        <Input
          id={queryId}
          type="search"
          placeholder="Buscar por nome ou email"
          value={filters.query}
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
        />
      </div>

      <div className="sm:w-56">
        <label htmlFor={originId} className="sr-only">
          Filtrar por origem
        </label>
        <Select
          id={originId}
          value={filters.origin}
          onChange={(event) => onChange({ ...filters, origin: event.target.value })}
        >
          <option value={ALL_ORIGINS}>Todas as origens</option>
          {ORIGINS.map((origin) => (
            <option key={origin} value={origin}>
              {origin}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
