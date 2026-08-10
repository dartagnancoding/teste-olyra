'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { LeadActions } from '@/features/leads/components/lead-actions'
import { SendWelcomeButton } from '@/features/leads/components/send-welcome-button'
import type { Lead } from '@/features/leads/types/lead'
import { formatDate } from '@/lib/utils/format'

type LeadTableProps = {
  leads: Lead[]
  emptyTitle: string
  emptyDescription: string
  onLeadUpdated: (lead: Lead) => void
  onLeadRemoved: (id: string) => void
}

/** Selo de boas-vindas, agora coluna própria — saiu de dentro do botão. */
function WelcomeStatus({ sentAt }: { sentAt: string | null }) {
  if (!sentAt) return <span className="text-sm text-text-muted">—</span>

  return (
    <Badge tone="success">
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="size-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 8.5l3.5 3.5L13 5" />
      </svg>
      Enviado
    </Badge>
  )
}

export function LeadTable({
  leads,
  emptyTitle,
  emptyDescription,
  onLeadUpdated,
  onLeadRemoved,
}: LeadTableProps) {
  if (leads.length === 0) {
    return (
      <Card>
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </Card>
    )
  }

  return (
    <Card>
      <table className="hidden w-full border-collapse text-left md:table">
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="px-5 py-3 text-sm font-medium text-text-muted">
              Nome
            </th>
            <th scope="col" className="px-5 py-3 text-sm font-medium text-text-muted">
              Email
            </th>
            <th scope="col" className="px-5 py-3 text-sm font-medium text-text-muted">
              Origem
            </th>
            <th scope="col" className="px-5 py-3 text-sm font-medium text-text-muted">
              Data
            </th>
            <th scope="col" className="px-5 py-3 text-sm font-medium text-text-muted">
              Boas-vindas
            </th>
            <th scope="col" className="px-5 py-3 text-right text-sm font-medium text-text-muted">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-border last:border-0">
              <td className="px-5 py-4 font-medium">{lead.name}</td>
              <td className="px-5 py-4 text-text-muted">{lead.email}</td>
              <td className="px-5 py-4">
                <Badge>{lead.origin}</Badge>
              </td>
              <td className="px-5 py-4 text-text-muted tabular-nums">
                {formatDate(lead.created_at)}
              </td>
              <td className="px-5 py-4">
                <span className="flex items-center gap-2">
                  <WelcomeStatus sentAt={lead.welcome_sent_at} />
                  <SendWelcomeButton lead={lead} onSent={onLeadUpdated} />
                </span>
              </td>
              <td className="px-2 py-4">
                <LeadActions
                  lead={lead}
                  onUpdated={onLeadUpdated}
                  onRemoved={onLeadRemoved}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="md:hidden">
        {leads.map((lead) => (
          <li
            key={lead.id}
            className="flex flex-col gap-3 border-b border-border p-5 last:border-0"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 flex-col gap-1">
                <p className="font-medium">{lead.name}</p>
                <p className="text-sm break-all text-text-muted">{lead.email}</p>
              </div>
              <LeadActions
                lead={lead}
                onUpdated={onLeadUpdated}
                onRemoved={onLeadRemoved}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{lead.origin}</Badge>
              <span className="text-sm text-text-muted tabular-nums">
                {formatDate(lead.created_at)}
              </span>
              {lead.welcome_sent_at ? (
                <WelcomeStatus sentAt={lead.welcome_sent_at} />
              ) : (
                <SendWelcomeButton lead={lead} onSent={onLeadUpdated} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
