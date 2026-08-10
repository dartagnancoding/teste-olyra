'use client'

import { motion, useReducedMotion } from 'motion/react'

import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { LeadCard } from '@/features/leads/components/lead-card'
import type { Lead } from '@/features/leads/types/lead'

type CardsViewProps = {
  leads: Lead[]
  emptyTitle: string
  emptyDescription: string
  onLeadUpdated: (lead: Lead) => void
  onLeadRemoved: (id: string) => void
}

const EASE_OUT_SOFT = [0, 0, 0.2, 1] as const

/**
 * Apresentação pura: recebe a lista já filtrada e ordenada.
 *
 * Antes este componente tinha `useLeadList` próprio, o que criava um segundo
 * estado paralelo — busca e filtro da lista não valiam aqui, e um lead
 * cadastrado numa visão não aparecia na outra. Agora as duas visões leem do
 * mesmo hook, em `CrmView`.
 */
export function CardsView({
  leads,
  emptyTitle,
  emptyDescription,
  onLeadUpdated,
  onLeadRemoved,
}: CardsViewProps) {
  const reduceMotion = useReducedMotion()

  if (leads.length === 0) {
    return (
      <Card>
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </Card>
    )
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {leads.map((lead, index) => (
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
          <LeadCard
            lead={lead}
            onLeadUpdated={onLeadUpdated}
            onLeadRemoved={onLeadRemoved}
          />
        </motion.li>
      ))}
    </ul>
  )
}
