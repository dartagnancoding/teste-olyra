import 'server-only'

import { welcomeMailer } from '@/features/leads/dependencies.server'
import type { RedirectNotice, WelcomeEmail } from '@/features/leads/types/welcome-mailer'
import { optionalEnv } from '@/lib/env'

export const PREVIEW_NAME = 'Mariana'
const PREVIEW_EMAIL = 'mariana@exemplo.com'

/**
 * Sai pela mesma porta que envia, então a tela mostra o que a caixa de entrada
 * recebe. Por isso a tarja entra aqui também: com `MAIL_REDIRECT_TO` ligado ela
 * faz parte do email de verdade, e escondê-la mostraria uma peça que ninguém
 * recebe.
 */
export function previewWelcomeEmail(name: string = PREVIEW_NAME): WelcomeEmail {
  const notice: RedirectNotice | undefined = optionalEnv('MAIL_REDIRECT_TO')
    ? { name, email: PREVIEW_EMAIL }
    : undefined

  return welcomeMailer.compose(name, notice)
}

export function isMailRedirected(): boolean {
  return optionalEnv('MAIL_REDIRECT_TO') !== null
}
