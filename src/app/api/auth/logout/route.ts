import { NextResponse } from 'next/server'

import { logout } from '@/features/auth/application/session'

export async function POST() {
  await logout()

  return NextResponse.json({ ok: true })
}
