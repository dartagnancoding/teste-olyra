'use client'

import { motion, useReducedMotion } from 'motion/react'

import { LeadCard } from '@/features/leads/components/lead-card'
import { SearchBar } from '@/features/leads/components/search-bar'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { useLeadList } from '@/features/leads/hooks/use-lead-list'
import type { Lead } from '@/features/leads/types/lead'

type CardsViewProps = {
  initialLeads: Lead[]
}

const EASE_OUT_SOFT = [0, 0, 0.2, 1] as const

export function CardsView({ initialLeads }: CardsViewProps) {
  const { visibleLeads, filters, setFilters, updateLead, isFiltered } =
    useLeadList(initialLeads)
  const reduceMotion = useReducedMotion()

  return (
    <div className="flex flex-col gap-8">
      <SearchBar filters={filters} onChange={setFilters} />

      {visibleLeads.length === 0 ? (
        <Card>
          <EmptyState
            title={isFiltered ? 'Nenhum lead encontrado' : 'Ainda sem leads'}
            description={
              isFiltered
                ? 'Ajuste a busca ou troque o filtro de origem para ver outros contatos.'
                : 'Cadastre o primeiro lead na aba Lista para vê-lo aparecer aqui.'
            }
          />
        </Card>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleLeads.map((lead, index) => (
            <motion.li
              key={lead.id}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: EASE_OUT_SOFT,
                delay: Math.min(index, 8) * 0.05,
              }}
            >
              <LeadCard lead={lead} onLeadUpdated={updateLead} />
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  )
}
