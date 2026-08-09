import { NextResponse } from 'next/server'

import { isAuthenticated } from '@/lib/auth'
import { leadRepository } from '@/lib/db/leads'
import { leadSchema } from '@/lib/validations'

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  try {
    return NextResponse.json({ leads: await leadRepository.getAll() })
  } catch {
    return NextResponse.json(
      { error: 'Não foi possível carregar os leads.' },
      { status: 502 },
    )
  }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const body: unknown = await request.json().catch(() => null)
  const parsed = leadSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Dados inválidos.',
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    )
  }

  try {
    return NextResponse.json({ lead: await leadRepository.create(parsed.data) }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Não foi possível cadastrar o lead.' },
      { status: 502 },
    )
  }
}
