import 'server-only'

import { credentialsChecker, sessionStore } from '@/features/auth/dependencies'

/**
 * Casos de uso de sessão. Os route handlers e o guard de rota dependem daqui,
 * nunca do cookie nem das variáveis de ambiente diretamente.
 */
export async function login(user: string, password: string): Promise<boolean> {
  if (!credentialsChecker.matches(user, password)) return false

  await sessionStore.create(credentialsChecker.currentUser())

  return true
}

export async function logout(): Promise<void> {
  await sessionStore.destroy()
}

export async function isAuthenticated(): Promise<boolean> {
  return sessionStore.isValid(credentialsChecker.currentUser())
}

/**
 * Credenciais exibidas na tela de login. Passa pela application para que o
 * componente não leia `process.env` — em uso real, retornar `null` aqui apaga
 * o bloco sem tocar na UI.
 */
export function getDemoCredentials(): { user: string; password: string } | null {
  const user = process.env.AUTH_USER
  const password = process.env.AUTH_PASSWORD

  return user && password ? { user, password } : null
}
