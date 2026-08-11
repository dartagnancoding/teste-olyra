'use client'

import { useState } from 'react'

import { CardsView } from '@/features/leads/components/cards-view'
import { LeadTable } from '@/features/leads/components/lead-table'
import { NewLeadButton } from '@/features/leads/components/new-lead-button'
import { SearchBar } from '@/features/leads/components/search-bar'
import { ToggleView, type ViewType } from '@/features/leads/components/toggle-view'
import { useLeadList } from '@/features/leads/hooks/use-lead-list'
import type { Lead } from '@/features/leads/types/lead'

type CrmViewProps = {
  initialLeads: Lead[]
}

export function CrmView({ initialLeads }: CrmViewProps) {
  const {
    visibleLeads,
    filters,
    setFilters,
    addLead,
    updateLead,
    removeLead,
    isFiltered,
  } = useLeadList(initialLeads)
  const [created, setCreated] = useState<string | null>(null)
  const [viewType, setViewType] = useState<ViewType>('table')

  function handleCreated(lead: Lead) {
    addLead(lead)
    setCreated(lead.name)
  }

  // Um estado vazio só, para as duas visões — elas mostram a mesma lista.
  const emptyTitle = isFiltered ? 'Nenhum lead encontrado' : 'Ainda sem leads'
  const emptyDescription = isFiltered
    ? 'Ajuste a busca ou troque o filtro de origem para ver outros contatos.'
    : 'Cadastre o primeiro lead no botão “Novo lead” para começar a acompanhar seus contatos.'

  return (
    <div className="flex flex-col gap-6">
      {/* O toggle e o botão vão como slots: quem decide o arranjo dos cinco
          controles é a barra, porque esse arranjo muda com a largura da tela. */}
      <SearchBar
        filters={filters}
        onChange={setFilters}
        viewToggle={<ToggleView value={viewType} onChange={setViewType} />}
        action={<NewLeadButton onCreated={handleCreated} />}
      />

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

      {viewType === 'table' ? (
        <LeadTable
          leads={visibleLeads}
          onLeadUpdated={updateLead}
          onLeadRemoved={removeLead}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
        />
      ) : (
        <CardsView
          leads={visibleLeads}
          onLeadUpdated={updateLead}
          onLeadRemoved={removeLead}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
        />
      )}
    </div>
  )
}
