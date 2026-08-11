import 'server-only'

import { Resend } from 'resend'

import {
  welcomeHtml,
  welcomeSubject,
  welcomeText,
} from '@/features/leads/data/welcome-email-template'
import type { WelcomeEmail, WelcomeMailer } from '@/features/leads/types/welcome-mailer'
import { requireEnv } from '@/lib/env'

/**
 * Fora do objeto, e não como `this.compose`: assim `send` continua correto
 * mesmo se alguém desestruturar o mailer (`const { send } = welcomeMailer`).
 */
function compose(name: string): WelcomeEmail {
  return {
    subject: welcomeSubject(name),
    html: welcomeHtml(name),
    text: welcomeText(name),
  }
}

export const resendWelcomeMailer: WelcomeMailer = {
  compose,

  async send(name, email) {
    const resend = new Resend(requireEnv('RESEND_API_KEY'))

    // Passa por `compose` de propósito: é o mesmo conteúdo que a tela de
    // pré-visualização mostra, sem chance de os dois caminhos divergirem.
    const { subject, html, text } = compose(name)

    const { error } = await resend.emails.send({
      from: requireEnv('RESEND_FROM'),
      to: email,
      subject,
      html,
      text,
    })

    if (!error) return { ok: true }

    console.error('[resend] falha ao enviar boas-vindas', error)

    return { ok: false, message: error.message || 'O Resend recusou o envio.' }
  },
}
