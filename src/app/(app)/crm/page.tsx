import type { Metadata } from 'next'

import { CrmView } from '@/components/leads/crm-view'
import { PageHeading } from '@/components/layout/page-heading'
import { ErrorState } from '@/components/ui/error-state'
import { loadLeads } from '@/lib/leads/load-leads'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Leads — Olyra',
}

export default async function CrmPage() {
  const result = await loadLeads()

  return (
    <>
      <PageHeading
        title="Leads"
        description="Cadastre novos contatos e acompanhe quem já recebeu as boas-vindas da Olyra."
      />

      {result.ok ? (
        <CrmView initialLeads={result.leads} />
      ) : (
        <ErrorState title="Erro ao carregar os leads" description={result.message} />
      )}
    </>
  )
}
