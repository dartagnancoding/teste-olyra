import 'server-only'

import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'node:crypto'

import type { SessionStore } from '@/features/auth/types/auth'
import { requireEnv } from '@/lib/env'

const COOKIE_NAME = 'olyra_session'
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8

/**
 * O valor do cookie é um HMAC do usuário, não o segredo em si. Assim o
 * SESSION_SECRET nunca trafega para o navegador e continua sendo impossível
 * forjar uma sessão sem conhecê-lo.
 */
function sign(user: string): string {
  return createHmac('sha256', requireEnv('SESSION_SECRET')).update(user).digest('hex')
}

export function safeEquals(a: string, b: string): boolean {
  const bufferA = Buffer.from(a)
  const bufferB = Buffer.from(b)

  return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB)
}

export const cookieSessionStore: SessionStore = {
  async create(user) {
    const store = await cookies()

    store.set(COOKIE_NAME, sign(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: '/',
    })
  },

  async destroy() {
    const store = await cookies()
    store.delete(COOKIE_NAME)
  },

  async isValid(user) {
    const store = await cookies()
    const token = store.get(COOKIE_NAME)?.value

    if (!token) return false

    return safeEquals(token, sign(user))
  },
}
