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
  viewToggle?: React.ReactNode
  action?: React.ReactNode
}

/**
 * No celular cada select divide a linha com um controle estreito, nunca com o
 * outro select: os dois juntos pedem 341px e há 316. A partir de `lg`,
 * `contents` dissolve os agrupadores e `order` recompõe a linha única — que
 * precisa de ~890px, daí o corte ser em `lg` e não em `sm`.
 */
export function SearchBar({
  filters,
  onChange,
  className,
  viewToggle,
  action,
}: SearchBarProps) {
  const queryId = useId()
  const originId = useId()
  const sortId = useId()

  return (
    <div className={cn('flex flex-col gap-3 lg:flex-row lg:items-center', className)}>
      <div className="lg:order-1 lg:flex-1">
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

      <div className="flex items-center gap-3 lg:contents">
        <div className="flex-1 lg:order-2 lg:w-56 lg:flex-none">
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

        {viewToggle && <div className="lg:order-4">{viewToggle}</div>}
      </div>

      <div className="flex items-center gap-3 lg:contents">
        <div className="flex-1 lg:order-3 lg:w-48 lg:flex-none">
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

        {action && <div className="lg:order-5">{action}</div>}
      </div>
    </div>
  )
}
