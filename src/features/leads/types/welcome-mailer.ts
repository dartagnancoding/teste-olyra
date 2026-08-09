export type SendResult = { ok: true } | { ok: false; message: string }

/**
 * Porta de envio do email de boas-vindas. Trocar Resend por SES, SendGrid ou
 * SMTP é escrever outra implementação em `data` — a application não muda.
 *
 * Falha de provedor é valor de retorno, não exceção: recusa de envio é um
 * cenário previsto, não um bug.
 */
export type WelcomeMailer = {
  send(name: string, email: string): Promise<SendResult>
}
