'use client'

import { useId } from 'react'

import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import {
  ALL_ORIGINS,
  SORTS,
  type LeadFilters,
  type SortKey,
} from '@/features/leads/application/filter-leads'
import { ORIGINS } from '@/features/leads/types/lead'
import { cn } from '@/lib/utils/cn'

type SearchBarProps = {
  filters: LeadFilters
  onChange: (filters: LeadFilters) => void
  className?: string
}

export function SearchBar({ filters, onChange, className }: SearchBarProps) {
  const queryId = useId()
  const originId = useId()
  const sortId = useId()

  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-center', className)}>
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

      <div className="sm:w-48">
        <label htmlFor={sortId} className="sr-only">
          Ordenar por
        </label>
        <Select
          id={sortId}
          value={filters.sort}
          onChange={(event) =>
            onChange({ ...filters, sort: event.target.value as SortKey })
          }
        >
          {Object.entries(SORTS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
