import 'server-only'

import { welcomeMailer } from '@/features/leads/dependencies.server'
import type { WelcomeEmail } from '@/features/leads/types/welcome-mailer'

/** Nome fictício da prévia — o email é personalizado, então precisa de um. */
export const PREVIEW_NAME = 'Mariana'

/**
 * Devolve o email de boas-vindas pronto, para exibição.
 *
 * Sai pela porta `WelcomeMailer`, a mesma que envia: o que aparece na tela é,
 * por construção, o que chega na caixa de entrada do lead.
 */
export function previewWelcomeEmail(name: string = PREVIEW_NAME): WelcomeEmail {
  return welcomeMailer.compose(name)
}
