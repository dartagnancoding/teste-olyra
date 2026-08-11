import { z } from 'zod'

import { ORIGINS } from '@/features/leads/types/lead'

/**
 * Contrato de entrada da feature. Vive em `types` porque é compartilhado pelos
 * três lados: o formulário valida com ele, o route handler revalida com ele e
 * o gateway deriva o tipo do payload dele.
 *
 * Além de validar, normaliza — o `trim`/`toLowerCase` acontece uma vez, aqui,
 * em vez de espalhado por quem chama.
 */
export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome completo'),
  // Normaliza **antes** de validar. Encadeado ao contrário (`z.email().trim()`)
  // o Zod checa o formato na string crua, e um email colado com espaço no fim
  // volta como "Email inválido" em vez de ser aparado. Foi assim que estava.
  email: z.string().trim().toLowerCase().pipe(z.email('Email inválido')),
  origin: z.enum(ORIGINS, { message: 'Selecione uma origem' }),
})

export type LeadInput = z.infer<typeof leadSchema>

export const sendWelcomeSchema = z.object({
  leadId: z.uuid('Lead inválido'),
})
