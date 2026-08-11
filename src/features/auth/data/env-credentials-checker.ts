import 'server-only'

import { safeEquals } from '@/features/auth/data/cookie-session-store'
import type { CredentialsChecker } from '@/features/auth/types/auth'
import { requireEnv } from '@/lib/env'

/**
 * `timingSafeEqual` para a checagem não vazar informação pelo tempo que leva
 * para falhar.
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
