import 'server-only'

import { leadRepository, welcomeMailer } from '@/features/leads/dependencies.server'
import type { LeadResult } from '@/features/leads/types/results'

/**
 * Orquestra repositório e mailer. Nenhum dos dois é conhecido concretamente
 * aqui — só os contratos —, então esta regra sobrevive à troca de Supabase e
 * de Resend sem uma linha alterada.
 */
export async function sendWelcome(leadId: string): Promise<LeadResult> {
  const lead = await leadRepository.getById(leadId).catch(() => null)

  if (!lead) return { ok: false, message: 'Lead não encontrado.' }

  // Dois cliques ou duas abas não podem gerar dois emails para o mesmo lead.
  if (lead.welcome_sent_at) return { ok: true, lead }

  const sent = await welcomeMailer.send(lead.name, lead.email)

  if (!sent.ok) return { ok: false, message: sent.message }

  try {
    return { ok: true, lead: await leadRepository.markWelcomeSent(lead.id, new Date()) }
  } catch (error) {
    // O email já saiu; devolver sucesso com o lead marcado em memória evita que
    // o operador reenvie por achar que falhou. Estado desatualizado até um
    // refresh é preferível a email duplicado para o cliente.
    console.error('[leads] email enviado, mas falhou ao marcar', error)

    return { ok: true, lead: { ...lead, welcome_sent_at: new Date().toISOString() } }
  }
}
