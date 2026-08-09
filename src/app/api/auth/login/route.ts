import { NextResponse } from 'next/server'

import { createSession, validateCredentials } from '@/lib/auth'
import { loginSchema } from '@/lib/validations'

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null)
  const parsed = loginSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Preencha usuário e senha.' }, { status: 400 })
  }

  if (!validateCredentials(parsed.data.user, parsed.data.password)) {
    return NextResponse.json({ error: 'Usuário ou senha inválidos.' }, { status: 401 })
  }

  await createSession()

  return NextResponse.json({ ok: true })
}
