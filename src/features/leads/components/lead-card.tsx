'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { LeadActions } from '@/features/leads/components/lead-actions'
import { WelcomeStatus } from '@/features/leads/components/welcome-status'
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
      className="flex h-full flex-col p-5 transition-colors duration-150 ease-out hover:border-sage sm:p-6"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <span
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sage text-sm font-semibold text-forest-deep sm:size-11"
        >
          {getInitials(lead.name)}
        </span>
        <h2 className="min-w-0 flex-1 truncate font-display text-lg leading-snug font-semibold">
          {lead.name}
        </h2>
        <LeadActions lead={lead} onUpdated={onLeadUpdated} onRemoved={onLeadRemoved} />
      </div>

      {/* O email ocupa a linha inteira, abaixo do avatar. Espremido entre o
          avatar e o menu ele tinha 185px e precisava de até 213 — quebrava no
          meio do domínio ("exemplo.co / m"). Aqui tem 287px e cabe inteiro. */}
      <p className="mt-3 mb-5 text-sm break-all text-text-muted">{lead.email}</p>

      {/* `mt-auto` mantém o rodapé colado embaixo, para que cards de alturas
          diferentes na mesma linha do grid alinhem origem e data. */}
      <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <Badge>{lead.origin}</Badge>
        <span className="text-sm text-text-muted tabular-nums">
          {formatDate(lead.created_at)}
        </span>
        {lead.welcome_sent_at && (
          <span className="ml-auto">
            <WelcomeStatus sentAt={lead.welcome_sent_at} />
          </span>
        )}
      </div>
    </Card>
  )
}
