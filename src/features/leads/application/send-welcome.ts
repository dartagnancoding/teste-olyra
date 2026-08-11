import 'server-only'

import { describeFailure } from '@/features/leads/application/describe-failure'
import { leadRepository, welcomeMailer } from '@/features/leads/dependencies.server'
import type { LeadResult } from '@/features/leads/types/results'

/** Só conhece os contratos: sobrevive à troca de Supabase e de Resend. */
export async function sendWelcome(leadId: string): Promise<LeadResult> {
  const found = await leadRepository.getById(leadId)

  // Banco fora do ar não é "lead não existe": o operador age diferente.
  if (!found.ok) return describeFailure(found.failure, 'leads.getById')

  const lead = found.data

  if (!lead) {
    return {
      ok: false,
      code: 'NOT_FOUND',
      message: 'Esse lead não existe mais. Recarregue a página.',
    }
  }

  // Dois cliques ou duas abas não podem gerar dois emails para o mesmo lead.
  if (lead.welcome_sent_at) return { ok: true, lead }

  const sent = await welcomeMailer.send(lead.name, lead.email)

  if (!sent.ok) {
    console.error(`[leads.sendWelcome] MAIL_REJECTED: ${sent.message}`)

    return { ok: false, code: 'MAIL_REJECTED', message: sent.message }
  }

  const marked = await leadRepository.markWelcomeSent(lead.id, new Date())

  if (!marked.ok) {
    // O email já saiu. Devolver sucesso com o lead marcado em memória evita
    // reenvio: estado desatualizado até um refresh é melhor que email
    // duplicado para o cliente.
    console.error(
      `[leads.markWelcomeSent] email enviado, mas o status não persistiu: ${marked.failure.detail}`,
    )

    return { ok: true, lead: { ...lead, welcome_sent_at: new Date().toISOString() } }
  }

  return { ok: true, lead: marked.data }
}
