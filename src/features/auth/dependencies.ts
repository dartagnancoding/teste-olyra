import 'server-only'

import { cookieSessionStore } from '@/features/auth/data/cookie-session-store'
import { envCredentialsChecker } from '@/features/auth/data/env-credentials-checker'
import type { CredentialsChecker, SessionStore } from '@/features/auth/types/auth'

export const sessionStore: SessionStore = cookieSessionStore
export const credentialsChecker: CredentialsChecker = envCredentialsChecker
