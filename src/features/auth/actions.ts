'use server'

import { login, logout } from '@/features/auth/application/session'
import { loginSchema, type LoginResult } from '@/features/auth/types/auth'

export async function loginAction(input: unknown): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, message: 'Preencha usuário e senha.' }
  }

  if (!(await login(parsed.data.user, parsed.data.password))) {
    return { ok: false, message: 'Usuário ou senha inválidos.' }
  }

  return { ok: true }
}

export async function logoutAction(): Promise<void> {
  await logout()
}
