import { z } from 'zod'

import { ORIGINS } from '@/types/lead'

export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome completo'),
  email: z.email('Email inválido').trim().toLowerCase(),
  origin: z.enum(ORIGINS, { message: 'Selecione uma origem' }),
})

export type LeadInput = z.infer<typeof leadSchema>

export const loginSchema = z.object({
  user: z.string().min(1, 'Informe o usuário'),
  password: z.string().min(1, 'Informe a senha'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const sendWelcomeSchema = z.object({
  leadId: z.uuid('Lead inválido'),
})
