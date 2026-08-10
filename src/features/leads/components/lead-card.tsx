'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { LeadActions } from '@/features/leads/components/lead-actions'
import type { Lead } from '@/features/leads/types/lead'
import { formatDate, getInitials } from '@/lib/utils/format'

type LeadCardProps = {
  lead: Lead
  onLeadUpdated: (lead: Lead) => void
  onLeadRemoved: (id: string) => void
}

export function LeadCard({ lead, onLeadUpdated, onLeadRemoved }: LeadCardProps) {
  return (
    <Card
      as="article"
      className="flex h-full flex-col gap-5 p-6 transition-colors duration-150 ease-out hover:border-sage"
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sage text-sm font-semibold text-forest-deep"
        >
          {getInitials(lead.name)}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg leading-snug font-semibold">{lead.name}</h2>
          <p className="mt-0.5 text-sm break-all text-text-muted">{lead.email}</p>
        </div>
        <LeadActions lead={lead} onUpdated={onLeadUpdated} onRemoved={onLeadRemoved} />
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <Badge>{lead.origin}</Badge>
        <span className="text-sm text-text-muted tabular-nums">
          {formatDate(lead.created_at)}
        </span>
        {lead.welcome_sent_at && <Badge tone="success">Boas-vindas enviadas</Badge>}
      </div>
    </Card>
  )
}
