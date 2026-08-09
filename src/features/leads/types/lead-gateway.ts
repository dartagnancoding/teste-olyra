import type { LeadInput } from '@/features/leads/types/lead-schema'
import type { Lead } from '@/features/leads/types/lead'

/**
 * Porta de acesso do navegador aos casos de uso, que do lado do client só são
 * alcançáveis por HTTP. Os componentes dependem deste tipo e nunca de `fetch`:
 * trocar REST por server actions ou tRPC é reescrever a implementação em `data`.
 *
 * Erro esperado sobe como `Error` com a mensagem já pronta para a tela.
 */
export type LeadGateway = {
  create(input: LeadInput): Promise<Lead>
  sendWelcome(leadId: string): Promise<Lead>
}
