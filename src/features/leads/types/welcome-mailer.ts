export type SendResult = { ok: true } | { ok: false; message: string }

/** O email pronto, do jeito que sai para o lead. */
export type WelcomeEmail = {
  subject: string
  html: string
  text: string
}

/**
 * Porta de envio do email de boas-vindas. Trocar Resend por SES, SendGrid ou
 * SMTP é escrever outra implementação em `data` — a application não muda.
 *
 * Falha de provedor é valor de retorno, não exceção: recusa de envio é um
 * cenário previsto, não um bug.
 *
 * `compose` existe separado de `send` para que a tela de pré-visualização leia
 * o email pela mesma porta que o envia. Se ela montasse o HTML por conta
 * própria, poderia divergir do que o lead recebe — e uma prévia que mente é
 * pior que nenhuma.
 */
export type WelcomeMailer = {
  compose(name: string): WelcomeEmail
  send(name: string, email: string): Promise<SendResult>
}
