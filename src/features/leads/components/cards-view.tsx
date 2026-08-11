'use client'

import { AnimatePresence, motion } from 'motion/react'

import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { LeadCard } from '@/features/leads/components/lead-card'
import { useLeadMotion } from '@/features/leads/components/lead-motion'
import type { Lead } from '@/features/leads/types/lead'

type CardsViewProps = {
  leads: Lead[]
  emptyTitle: string
  emptyDescription: string
  onLeadUpdated: (lead: Lead) => void
  onLeadRemoved: (id: string) => void
}

/**
 * Recebe a lista já filtrada. Com `useLeadList` próprio, como era antes, um
 * lead cadastrado numa visão não aparecia na outra.
 */
export function CardsView({
  leads,
  emptyTitle,
  emptyDescription,
  onLeadUpdated,
  onLeadRemoved,
}: CardsViewProps) {
  const leadMotion = useLeadMotion()

  if (leads.length === 0) {
    return (
      <Card>
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </Card>
    )
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* `popLayout` tira o card do fluxo antes de animar: sem isso os
          vizinhos dariam um salto seco para preencher o buraco. */}
      <AnimatePresence mode="popLayout">
        {leads.map((lead, index) => (
          <motion.li key={lead.id} layout {...leadMotion(index)}>
            <LeadCard
              lead={lead}
              onLeadUpdated={onLeadUpdated}
              onLeadRemoved={onLeadRemoved}
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}
