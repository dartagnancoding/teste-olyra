import 'server-only'

import { safeEquals } from '@/features/auth/data/cookie-session-store'
import type { CredentialsChecker } from '@/features/auth/types/auth'
import { requireEnv } from '@/lib/env'

/**
 * Credencial única vinda do ambiente — é o que o desafio pede. Trocar por uma
 * tabela `users` com senha hasheada é escrever outro arquivo nesta pasta e
 * apontar `features/auth/dependencies.ts` para ele.
 *
 * A comparação passa por `timingSafeEqual` para não vazar informação pelo
 * tempo que a checagem leva para falhar.
 */
export const envCredentialsChecker: CredentialsChecker = {
  matches(user, password) {
    return (
      safeEquals(user, requireEnv('AUTH_USER')) &&
      safeEquals(password, requireEnv('AUTH_PASSWORD'))
    )
  },

  currentUser() {
    return requireEnv('AUTH_USER')
  },
}
