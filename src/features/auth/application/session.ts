import 'server-only'

import { credentialsChecker, sessionStore } from '@/features/auth/dependencies'

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

/** Retornar `null` aqui apaga o bloco da tela de login sem tocar na UI. */
export function getDemoCredentials(): { user: string; password: string } | null {
  const user = process.env.AUTH_USER
  const password = process.env.AUTH_PASSWORD

  return user && password ? { user, password } : null
}
