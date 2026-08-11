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
  /** Alternador de visualização, encaixado ao lado do filtro de origem. */
  viewToggle?: React.ReactNode
  /** Ação principal da tela, encaixada ao lado da ordenação. */
  action?: React.ReactNode
}

/**
 * Barra de controles da lista. Recebe o toggle e a ação principal como slots
 * porque o arranjo dos cinco controles é uma decisão só, e ela muda com a
 * largura.
 *
 * A 360px os três controles empilhados custavam 212px de altura antes do
 * primeiro lead. Emparelhá-los dois a dois resolveria — mas os dois selects
 * não cabem lado a lado: "Todas as origens" pede 130px de texto e sobrariam
 * 107. Então cada select divide a linha com um controle estreito (o toggle, o
 * botão), e ambos ficam folgados:
 *
 *     [ Buscar por nome ou email        ]
 *     [ Todas as origens ▾ ] [ ≡ | ⊞ ]
 *     [ Mais recentes ▾ ]  [ + Novo lead ]
 *
 * A partir de `lg`, `contents` dissolve os agrupadores de linha: os cinco
 * voltam a ser itens diretos do flex, e `order` recompõe a sequência do
 * desktop (busca, origem, ordenação, toggle, ação).
 *
 * O corte é em `lg` (1024px), não em `sm`: a linha única precisa de ~890px
 * (224 + 192 do dois selects, 84 do toggle, 142 do botão, mais a busca e os
 * vãos). Ligada em `sm`, ela transbordava em qualquer largura de tablet — e é
 * o mesmo ponto em que a tabela entra no lugar dos cartões.
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
