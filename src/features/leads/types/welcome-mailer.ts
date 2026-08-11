export type SendResult = { ok: true } | { ok: false; message: string }

/**
 * Destinatário que o email teria em produção, quando o envio foi desviado.
 *
 * Existe porque a conta de email do desafio está em modo de teste e só entrega
 * no endereço do administrador. Em vez de tratar isso como falha, o envio é
 * desviado e o email carrega uma tarja dizendo para quem ele iria — dá para
 * encaminhar a peça como prova de que o disparo funciona.
 */
export type RedirectNotice = {
  name: string
  email: string
}

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
  compose(name: string, notice?: RedirectNotice): WelcomeEmail
  send(name: string, email: string): Promise<SendResult>
}
