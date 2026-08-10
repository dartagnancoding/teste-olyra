import type { Metadata } from 'next'

import { CardsView } from '@/features/leads/components/cards-view'
import { PageHeading } from '@/components/layout/page-heading'
import { ErrorState } from '@/components/ui/error-state'
import { getLeads } from '@/features/leads/application/get-leads'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Cards — Olyra',
}

export default async function CardsPage() {
  const result = await getLeads()

  return (
    <>
      <PageHeading
        title="Cards"
        description="A mesma base de leads em formato visual, para uma leitura rápida do funil."
      />

      {result.ok ? (
        <CardsView initialLeads={result.leads} />
      ) : (
        <ErrorState
          title="Erro ao carregar os leads"
          description={result.message}
          code={result.code}
        />
      )}
    </>
  )
}
