import { z } from 'zod'

import { ORIGINS } from '@/features/leads/types/lead'

/** Um contrato só: o formulário valida com ele e a action revalida com ele. */
export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome completo'),
  // Normaliza antes de validar. Ao contrário (`z.email().trim()`) o Zod checa
  // o formato na string crua, e um email colado com espaço no fim volta como
  // "Email inválido" em vez de ser aparado. Foi assim que estava.
  email: z.string().trim().toLowerCase().pipe(z.email('Email inválido')),
  origin: z.enum(ORIGINS, { message: 'Selecione uma origem' }),
})

export type LeadInput = z.infer<typeof leadSchema>

export const sendWelcomeSchema = z.object({
  leadId: z.uuid('Lead inválido'),
})
