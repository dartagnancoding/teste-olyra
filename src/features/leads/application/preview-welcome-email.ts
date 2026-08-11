import 'server-only'

import { welcomeMailer } from '@/features/leads/dependencies.server'
import type { RedirectNotice, WelcomeEmail } from '@/features/leads/types/welcome-mailer'
import { optionalEnv } from '@/lib/env'

/** Nome fictício da prévia — o email é personalizado, então precisa de um. */
export const PREVIEW_NAME = 'Mariana'

/** Endereço fictício, no mesmo lugar onde iria o do lead. */
const PREVIEW_EMAIL = 'mariana@exemplo.com'

/**
 * Devolve o email de boas-vindas pronto, para exibição.
 *
 * Sai pela porta `WelcomeMailer`, a mesma que envia: o que aparece na tela é,
 * por construção, o que chega na caixa de entrada do lead.
 *
 * A tarja de envio demonstrativo entra aqui quando `MAIL_REDIRECT_TO` está
 * configurado, porque nesse modo ela faz parte do email de verdade. Uma prévia
 * que esconde a tarja mostraria uma peça que ninguém recebe.
 */
export function previewWelcomeEmail(name: string = PREVIEW_NAME): WelcomeEmail {
  const notice: RedirectNotice | undefined = optionalEnv('MAIL_REDIRECT_TO')
    ? { name, email: PREVIEW_EMAIL }
    : undefined

  return welcomeMailer.compose(name, notice)
}

/** A tela avisa que os envios estão sendo desviados. */
export function isMailRedirected(): boolean {
  return optionalEnv('MAIL_REDIRECT_TO') !== null
}
