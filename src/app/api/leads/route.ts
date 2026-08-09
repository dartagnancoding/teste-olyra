import { NextResponse } from 'next/server'

import { isAuthenticated } from '@/features/auth/application/session'
import { createLead } from '@/features/leads/application/create-lead'
import { getLeads } from '@/features/leads/application/get-leads'
import { leadSchema } from '@/features/leads/types/lead-schema'

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const result = await getLeads()

  return result.ok
    ? NextResponse.json({ leads: result.leads })
    : NextResponse.json({ error: result.message }, { status: 502 })
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const body: unknown = await request.json().catch(() => null)
  const parsed = leadSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos.', fields: parsed.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const result = await createLead(parsed.data)

  return result.ok
    ? NextResponse.json({ lead: result.lead }, { status: 201 })
    : NextResponse.json({ error: result.message }, { status: 502 })
}
