import type { Metadata } from 'next'

import { CardsView } from '@/components/leads/cards-view'
import { PageHeading } from '@/components/layout/page-heading'
import { ErrorState } from '@/components/ui/error-state'
import { loadLeads } from '@/lib/leads/load-leads'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Cards — Olyra',
}

export default async function CardsPage() {
  const result = await loadLeads()

  return (
    <>
      <PageHeading
        title="Cards"
        description="A mesma base de leads em formato visual, para uma leitura rápida do funil."
      />

      {result.ok ? (
        <CardsView initialLeads={result.leads} />
      ) : (
        <ErrorState title="Erro ao carregar os leads" description={result.message} />
      )}
    </>
  )
}
