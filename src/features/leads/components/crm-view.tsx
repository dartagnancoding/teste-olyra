'use client'

import { LeadForm } from '@/features/leads/components/lead-form'
import { LeadTable } from '@/features/leads/components/lead-table'
import { OriginSummary } from '@/features/leads/components/origin-summary'
import { SearchBar } from '@/features/leads/components/search-bar'
import { Card } from '@/components/ui/card'
import { useLeadList } from '@/features/leads/hooks/use-lead-list'
import type { Lead } from '@/features/leads/types/lead'

type CrmViewProps = {
  initialLeads: Lead[]
}

export function CrmView({ initialLeads }: CrmViewProps) {
  const { leads, visibleLeads, filters, setFilters, addLead, updateLead, isFiltered } =
    useLeadList(initialLeads)

  return (
    <div className="grid gap-8 lg:grid-cols-3 lg:items-start lg:gap-10">
      <Card as="section" aria-label="Cadastrar lead" className="p-6 lg:sticky lg:top-8">
        <h2 className="mb-6 font-display text-xl font-semibold">Novo lead</h2>
        <LeadForm onCreated={addLead} />
      </Card>

      <div className="flex flex-col gap-6 lg:col-span-2">
        <OriginSummary leads={leads} />
        <SearchBar filters={filters} onChange={setFilters} />
        <LeadTable
          leads={visibleLeads}
          onLeadUpdated={updateLead}
          emptyTitle={isFiltered ? 'Nenhum lead encontrado' : 'Ainda sem leads'}
          emptyDescription={
            isFiltered
              ? 'Ajuste a busca ou troque o filtro de origem para ver outros contatos.'
              : 'Cadastre o primeiro lead no formulário ao lado para começar a acompanhar seus contatos.'
          }
        />
      </div>
    </div>
  )
}
