'use client'

import { useState } from 'react'

import { LeadTable } from '@/features/leads/components/lead-table'
import { NewLeadButton } from '@/features/leads/components/new-lead-button'
import { OriginSummary } from '@/features/leads/components/origin-summary'
import { SearchBar } from '@/features/leads/components/search-bar'
import { useLeadList } from '@/features/leads/hooks/use-lead-list'
import type { Lead } from '@/features/leads/types/lead'

type CrmViewProps = {
  initialLeads: Lead[]
}

export function CrmView({ initialLeads }: CrmViewProps) {
  const { leads, visibleLeads, filters, setFilters, addLead, updateLead, isFiltered } =
    useLeadList(initialLeads)
  const [created, setCreated] = useState<string | null>(null)

  function handleCreated(lead: Lead) {
    addLead(lead)
    setCreated(lead.name)
  }

  return (
    <div className="flex flex-col gap-6">
      <OriginSummary leads={leads} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar filters={filters} onChange={setFilters} className="flex-1" />
        <NewLeadButton onCreated={handleCreated} />
      </div>

      {/* O modal fecha ao cadastrar, então a confirmação precisa viver aqui,
          fora dele — senão o operador não vê que deu certo. */}
      {created && (
        <p
          role="status"
          className="rounded-md bg-success-soft px-4 py-2.5 text-sm text-success"
        >
          Lead cadastrado: <strong className="font-medium">{created}</strong>
        </p>
      )}

      <LeadTable
        leads={visibleLeads}
        onLeadUpdated={updateLead}
        emptyTitle={isFiltered ? 'Nenhum lead encontrado' : 'Ainda sem leads'}
        emptyDescription={
          isFiltered
            ? 'Ajuste a busca ou troque o filtro de origem para ver outros contatos.'
            : 'Cadastre o primeiro lead no botão “Novo lead” para começar a acompanhar seus contatos.'
        }
      />
    </div>
  )
}
