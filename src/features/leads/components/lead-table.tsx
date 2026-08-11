'use client'

import { AnimatePresence, motion } from 'motion/react'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { LeadActions } from '@/features/leads/components/lead-actions'
import { useLeadMotion } from '@/features/leads/components/lead-motion'
import { SendWelcomeButton } from '@/features/leads/components/send-welcome-button'
import { WelcomeStatus } from '@/features/leads/components/welcome-status'
import type { Lead } from '@/features/leads/types/lead'
import { formatDate } from '@/lib/utils/format'

type LeadTableProps = {
  leads: Lead[]
  emptyTitle: string
  emptyDescription: string
  onLeadUpdated: (lead: Lead) => void
  onLeadRemoved: (id: string) => void
}

/**
 * A troca é em `lg` e não em `md` porque a tabela mede 976px de largura
 * mínima: em 768px ela criava rolagem horizontal em qualquer tablet.
 */
export function LeadTable({
  leads,
  emptyTitle,
  emptyDescription,
  onLeadUpdated,
  onLeadRemoved,
}: LeadTableProps) {
  const leadMotion = useLeadMotion()

  if (leads.length === 0) {
    return (
      <Card>
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </Card>
    )
  }

  return (
    <Card>
      <table className="hidden w-full border-collapse text-left lg:table">
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
        {/* Sem `popLayout` nem `layout`: os dois tiram o elemento do fluxo
            com `position: absolute`, o que destrói as colunas de uma `<tr>`. */}
        <tbody>
          <AnimatePresence>
            {leads.map((lead, index) => (
              <motion.tr
                key={lead.id}
                {...leadMotion(index)}
                className="border-b border-border last:border-0"
              >
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
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>

      <ul className="lg:hidden">
        <AnimatePresence mode="popLayout">
          {leads.map((lead, index) => (
            <motion.li
              key={lead.id}
              layout
              {...leadMotion(index)}
              className="flex flex-col gap-3 border-b border-border p-4 last:border-0 sm:p-5"
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
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <Badge>{lead.origin}</Badge>
                <span className="text-sm text-text-muted tabular-nums">
                  {formatDate(lead.created_at)}
                </span>
                {/* `h-8` fixo: o selo tem 28px e o botão 32px, e sem isso a
                    linha muda de altura conforme o lead já recebeu ou não. */}
                <span className="ml-auto flex h-8 shrink-0 items-center">
                  {lead.welcome_sent_at ? (
                    <WelcomeStatus sentAt={lead.welcome_sent_at} />
                  ) : (
                    <SendWelcomeButton lead={lead} onSent={onLeadUpdated} />
                  )}
                </span>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </Card>
  )
}
