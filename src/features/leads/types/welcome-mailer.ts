export type SendResult = { ok: true } | { ok: false; message: string }

/** Para quem o email iria, quando o envio é desviado para o administrador. */
export type RedirectNotice = {
  name: string
  email: string
}

export type WelcomeEmail = {
  subject: string
  html: string
  text: string
}

/**
 * Falha de provedor é valor de retorno, não exceção: recusa de envio é cenário
 * previsto, não bug.
 *
 * `compose` é separado de `send` para a prévia ler o email pela mesma porta que
 * o envia — montando o HTML por conta própria, ela poderia divergir do que o
 * lead recebe, e uma prévia que mente é pior que nenhuma.
 */
export type WelcomeMailer = {
  compose(name: string, notice?: RedirectNotice): WelcomeEmail
  send(name: string, email: string): Promise<SendResult>
}
