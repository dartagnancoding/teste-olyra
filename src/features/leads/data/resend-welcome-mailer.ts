import 'server-only'

import { Resend } from 'resend'

import {
  welcomeHtml,
  welcomeSubject,
  welcomeText,
} from '@/features/leads/data/welcome-email-template'
import type { WelcomeMailer } from '@/features/leads/types/welcome-mailer'
import { requireEnv } from '@/lib/env'

export const resendWelcomeMailer: WelcomeMailer = {
  async send(name, email) {
    const resend = new Resend(requireEnv('RESEND_API_KEY'))

    const { error } = await resend.emails.send({
      from: requireEnv('RESEND_FROM'),
      to: email,
      subject: welcomeSubject(name),
      html: welcomeHtml(name),
      text: welcomeText(name),
    })

    if (!error) return { ok: true }

    console.error('[resend] falha ao enviar boas-vindas', error)

    return { ok: false, message: error.message || 'O Resend recusou o envio.' }
  },
}
