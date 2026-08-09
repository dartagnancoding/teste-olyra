import { Card } from '@/components/ui/card'
import { countByOrigin } from '@/features/leads/application/filter-leads'
import type { Lead } from '@/features/leads/types/lead'

type OriginSummaryProps = {
  leads: Lead[]
}

export function OriginSummary({ leads }: OriginSummaryProps) {
  if (leads.length === 0) return null

  return (
    <Card as="section" aria-label="Resumo por origem" className="p-5">
      <dl className="flex flex-wrap gap-x-8 gap-y-4">
        <div className="flex flex-col gap-1">
          <dt className="text-sm text-text-muted">Total</dt>
          <dd className="font-display text-2xl leading-none font-semibold text-forest">
            {leads.length}
          </dd>
        </div>
        {countByOrigin(leads).map(({ origin, total }) => (
          <div key={origin} className="flex flex-col gap-1">
            <dt className="text-sm text-text-muted">{origin}</dt>
            <dd className="text-2xl leading-none font-medium tabular-nums">{total}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
