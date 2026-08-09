'use client'

import { SendWelcomeButton } from '@/components/leads/send-welcome-button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { formatDate } from '@/lib/utils/format'
import type { Lead } from '@/types/lead'

type LeadTableProps = {
  leads: Lead[]
  emptyTitle: string
  emptyDescription: string
  onLeadUpdated: (lead: Lead) => void
}

export function LeadTable({
  leads,
  emptyTitle,
  emptyDescription,
  onLeadUpdated,
}: LeadTableProps) {
  if (leads.length === 0) {
    return (
      <Card>
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
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
              Ação
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
                <SendWelcomeButton lead={lead} onSent={onLeadUpdated} />
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
            <div className="flex flex-col gap-1">
              <p className="font-medium">{lead.name}</p>
              <p className="text-sm break-all text-text-muted">{lead.email}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge>{lead.origin}</Badge>
              <span className="text-sm text-text-muted tabular-nums">
                {formatDate(lead.created_at)}
              </span>
            </div>
            <SendWelcomeButton lead={lead} onSent={onLeadUpdated} block />
          </li>
        ))}
      </ul>
    </Card>
  )
}
