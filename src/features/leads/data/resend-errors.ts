/**
 * A mensagem da Resend é em inglês e fala de painel de domínio e do campo
 * `from`. Pior: ela embute o endereço dono da conta, que não pode aparecer
 * para quem usa o painel. Mesmo princípio de `describeFailure` — texto cru no
 * log, frase acionável na tela.
 */

const SANDBOX_MARKERS = [
  "only send testing emails",
  "your own email address",
  "verify a domain",
];

const RATE_LIMIT_MARKERS = ["too many requests", "rate limit"];

const CREDENTIAL_MARKERS = ["api key is invalid", "missing api key", "unauthorized"];

function matches(message: string, markers: string[]): boolean {
  const lower = message.toLowerCase();

  return markers.some((marker) => lower.includes(marker));
}

export function describeResendError(message: string): string {
  if (matches(message, SANDBOX_MARKERS)) {
    return (
      "O provedor de email está em modo de teste e só entrega no endereço " +
      "dono da conta. O lead foi salvo e continua marcado como pendente — " +
      "verifique um domínio no provedor para liberar o envio a qualquer destinatário."
    );
  }

  if (matches(message, RATE_LIMIT_MARKERS)) {
    return "O provedor de email recusou por excesso de envios seguidos. Tente de novo em alguns instantes.";
  }

  if (matches(message, CREDENTIAL_MARKERS)) {
    return "O provedor de email recusou a credencial da aplicação. Avise quem administra o painel.";
  }

  return "Não foi possível enviar o email agora. O lead continua marcado como pendente — tente novamente.";
}
