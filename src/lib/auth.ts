import 'server-only'

import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'node:crypto'

import { requireEnv } from '@/lib/env'

const COOKIE_NAME = 'olyra_session'
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8

/**
 * O valor do cookie é um HMAC do usuário, não o segredo em si. Assim o
 * SESSION_SECRET nunca trafega para o navegador e continua sendo impossível
 * forjar uma sessão sem conhecê-lo.
 */
function signSession(user: string): string {
  return createHmac('sha256', requireEnv('SESSION_SECRET')).update(user).digest('hex')
}

function safeEquals(a: string, b: string): boolean {
  const bufferA = Buffer.from(a)
  const bufferB = Buffer.from(b)

  return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB)
}

export function validateCredentials(user: string, password: string): boolean {
  return (
    safeEquals(user, requireEnv('AUTH_USER')) &&
    safeEquals(password, requireEnv('AUTH_PASSWORD'))
  )
}

export async function createSession(): Promise<void> {
  const store = await cookies()

  store.set(COOKIE_NAME, signSession(requireEnv('AUTH_USER')), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: '/',
  })
}

export async function destroySession(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value

  if (!token) return false

  return safeEquals(token, signSession(requireEnv('AUTH_USER')))
}
