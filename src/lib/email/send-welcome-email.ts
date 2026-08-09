import 'server-only'

import { Resend } from 'resend'

import {
  welcomeHtml,
  welcomeSubject,
  welcomeText,
} from '@/lib/email/welcome-template'
import { requireEnv } from '@/lib/env'

export type SendResult = { ok: true } | { ok: false; message: string }

export async function sendWelcomeEmail(name: string, email: string): Promise<SendResult> {
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
}
