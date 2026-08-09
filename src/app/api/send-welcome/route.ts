import { NextResponse } from 'next/server'

import { isAuthenticated } from '@/lib/auth'
import { leadRepository } from '@/lib/db/leads'
import { sendWelcomeEmail } from '@/lib/email/send-welcome-email'
import { sendWelcomeSchema } from '@/lib/validations'

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const body: unknown = await request.json().catch(() => null)
  const parsed = sendWelcomeSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Lead inválido.' }, { status: 422 })
  }

  const lead = await leadRepository.getById(parsed.data.leadId).catch(() => null)

  if (!lead) {
    return NextResponse.json({ error: 'Lead não encontrado.' }, { status: 404 })
  }

  if (lead.welcome_sent_at) {
    return NextResponse.json({ lead })
  }

  const sent = await sendWelcomeEmail(lead.name, lead.email)

  if (!sent.ok) {
    return NextResponse.json({ error: sent.message }, { status: 502 })
  }

  try {
    return NextResponse.json({ lead: await leadRepository.markWelcomeSent(lead.id, new Date()) })
  } catch {
    // O email já saiu; devolver 200 com o lead marcado em memória evita que o
    // operador reenvie por achar que falhou.
    return NextResponse.json({
      lead: { ...lead, welcome_sent_at: new Date().toISOString() },
    })
  }
}
