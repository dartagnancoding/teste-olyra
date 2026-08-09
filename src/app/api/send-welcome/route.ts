import { NextResponse } from 'next/server'

import { isAuthenticated } from '@/features/auth/application/session'
import { sendWelcome } from '@/features/leads/application/send-welcome'
import { sendWelcomeSchema } from '@/features/leads/types/lead-schema'

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const body: unknown = await request.json().catch(() => null)
  const parsed = sendWelcomeSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Lead inválido.' }, { status: 422 })
  }

  const result = await sendWelcome(parsed.data.leadId)

  if (result.ok) return NextResponse.json({ lead: result.lead })

  return NextResponse.json(
    { error: result.message },
    { status: result.reason === 'not-found' ? 404 : 502 },
  )
}
