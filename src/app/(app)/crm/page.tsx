import type { Metadata } from 'next'

import { CrmView } from '@/features/leads/components/crm-view'
import { PageHeading } from '@/components/layout/page-heading'
import { ErrorState } from '@/components/ui/error-state'
import { getLeads } from '@/features/leads/application/get-leads'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Leads — Olyra',
}

export default async function CrmPage() {
  const result = await getLeads()

  return (
    <>
      <PageHeading
        title="Leads"
        description="Cadastre novos contatos e acompanhe quem já recebeu as boas-vindas da Olyra."
      />

      {result.ok ? (
        <CrmView initialLeads={result.leads} />
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
