import { NextResponse } from 'next/server'

import { login } from '@/features/auth/application/session'
import { loginSchema } from '@/features/auth/types/auth'

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null)
  const parsed = loginSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Preencha usuário e senha.' }, { status: 400 })
  }

  if (!(await login(parsed.data.user, parsed.data.password))) {
    return NextResponse.json({ error: 'Usuário ou senha inválidos.' }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
