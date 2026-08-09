'use client'

import { useCallback, useMemo, useState } from 'react'

import { ALL_ORIGINS, filterLeads, type LeadFilters } from '@/lib/leads/filter-leads'
import type { Lead } from '@/types/lead'

/**
 * Guarda a lista recebida do servidor e a mantém sincronizada após cadastro ou
 * envio de boas-vindas, sem refazer o fetch — a lista é pequena e a mutação já
 * devolve o lead atualizado.
 */
export function useLeadList(initialLeads: Lead[]) {
  const [leads, setLeads] = useState(initialLeads)
  const [filters, setFilters] = useState<LeadFilters>({
    query: '',
    origin: ALL_ORIGINS,
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

  const isFiltered = filters.query.trim() !== '' || filters.origin !== ALL_ORIGINS

  return { leads, visibleLeads, filters, setFilters, addLead, updateLead, isFiltered }
}
