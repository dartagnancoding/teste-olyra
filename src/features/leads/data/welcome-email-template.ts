/**
 * HTML de email é escrito com tabelas e estilo inline de propósito: clientes
 * como Outlook e Gmail ignoram folhas de estilo e boa parte do CSS moderno.
 * Os valores hex repetem os tokens da paleta Olyra porque `var()` não é
 * suportado em email.
 */

import type { RedirectNotice } from '@/features/leads/types/welcome-mailer'

const FOREST = '#3c5b43'
const FOREST_DEEP = '#061b0c'
const CREAM = '#f8f4e8'
const SAGE = '#a3c4a8'
const TEXT_MUTED = '#5a6b5e'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function welcomeSubject(name: string): string {
  return `Bem-vindo à Olyra, ${name}!`
}

export function welcomeText(name: string, notice?: RedirectNotice): string {
  const header = notice
    ? [
        '--------------------------------------------------',
        `ENVIO DEMONSTRATIVO — destinatário original: ${notice.name} <${notice.email}>`,
        'A conta de email está em modo de teste e só entrega no endereço do',
        'administrador. Em produção, este email iria direto para o lead.',
        '--------------------------------------------------',
        '',
      ]
    : []

  return [
    ...header,
    `Olá, ${name}!`,
    '',
    'Que bom ter você por aqui.',
    '',
    'Na Olyra, criamos aromatizadores pensados para transformar ambientes em espaços de bem-estar. Cada essência é escolhida com cuidado para acompanhar seus momentos.',
    '',
    'Em breve entraremos em contato para apresentar nossa linha e entender como podemos atender você melhor.',
    '',
    'Com carinho,',
    'Equipe Olyra',
  ].join('\n')
}

/**
 * Tarja de envio demonstrativo.
 *
 * Fica **fora** do cartão branco, em cinza e corpo menor: precisa ser lida
 * como carimbo de entrega, não como parte da mensagem da Olyra. Quem
 * encaminhar este email mostra, na própria peça, para quem ela iria.
 */
function redirectBanner(notice: RedirectNotice): string {
  const safeName = escapeHtml(notice.name)
  const safeEmail = escapeHtml(notice.email)

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;margin:0 0 16px 0;">
            <tr>
              <td style="padding:12px 16px;background-color:#ffffff;border:1px dashed ${SAGE};border-radius:10px;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.5;color:${TEXT_MUTED};">
                <strong style="color:${FOREST};">Envio demonstrativo.</strong>
                Este email era para <strong style="color:${FOREST_DEEP};">${safeName} &lt;${safeEmail}&gt;</strong>.
                A conta de email está em modo de teste e só entrega no endereço do administrador; em produção ele iria direto para o lead.
              </td>
            </tr>
          </table>`
}

export function welcomeHtml(name: string, notice?: RedirectNotice): string {
  const safeName = escapeHtml(name)

  return `<!doctype html>
<html lang="pt-BR">
  <body style="margin:0;padding:0;background-color:${CREAM};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${CREAM};padding:32px 16px;">
      <tr>
        <td align="center">
          ${notice ? redirectBanner(notice) : ''}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background-color:#ffffff;border:1px solid ${SAGE};border-radius:10px;">
            <tr>
              <td style="padding:32px 32px 8px 32px;">
                <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:600;color:${FOREST_DEEP};">Olyra</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px 32px;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:${FOREST_DEEP};">
                <h1 style="margin:16px 0 24px 0;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.25;font-weight:600;color:${FOREST};">Olá, ${safeName}!</h1>
                <p style="margin:0 0 16px 0;">Que bom ter você por aqui.</p>
                <p style="margin:0 0 16px 0;">Na Olyra, criamos aromatizadores pensados para transformar ambientes em espaços de bem-estar. Cada essência é escolhida com cuidado para acompanhar seus momentos.</p>
                <p style="margin:0 0 24px 0;">Em breve entraremos em contato para apresentar nossa linha e entender como podemos atender você melhor.</p>
                <p style="margin:0;color:${TEXT_MUTED};">Com carinho,<br />Equipe Olyra</p>
              </td>
            </tr>
          </table>
          <p style="margin:24px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:${TEXT_MUTED};">Você recebeu este email porque foi cadastrado como lead da Olyra.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`
}
