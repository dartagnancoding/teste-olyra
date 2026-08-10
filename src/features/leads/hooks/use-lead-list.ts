'use client'

import { useCallback, useMemo, useState } from 'react'

import {
  ALL_ORIGINS,
  DEFAULT_SORT,
  filterLeads,
  type LeadFilters,
} from '@/features/leads/application/filter-leads'
import type { Lead } from '@/features/leads/types/lead'

/**
 * Guarda a lista recebida do servidor e a mantém sincronizada após cadastro,
 * envio de boas-vindas ou exclusão, sem refazer o fetch — a lista é pequena e
 * a mutação já devolve o registro afetado.
 */
export function useLeadList(initialLeads: Lead[]) {
  const [leads, setLeads] = useState(initialLeads)
  const [filters, setFilters] = useState<LeadFilters>({
    query: '',
    origin: ALL_ORIGINS,
    sort: DEFAULT_SORT,
  })

  const visibleLeads = useMemo(() => filterLeads(leads, filters), [leads, filters])

  const addLead = useCallback((lead: Lead) => {
    setLeads((current) => [lead, ...current])
  }, [])

  const updateLead = useCallback((updated: Lead) => {
    setLeads((current) =>
      current.map((lead) => (lead.id === updated.id ? updated : lead)),
    )
  }, [])

  const removeLead = useCallback((id: string) => {
    setLeads((current) => current.filter((lead) => lead.id !== id))
  }, [])

  // A ordenação não conta como filtro: com ela ativa a lista continua completa,
  // então o estado vazio deve seguir dizendo "cadastre o primeiro lead".
  const isFiltered = filters.query.trim() !== '' || filters.origin !== ALL_ORIGINS

  return {
    leads,
    visibleLeads,
    filters,
    setFilters,
    addLead,
    updateLead,
    removeLead,
    isFiltered,
  }
}
