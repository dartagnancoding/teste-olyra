import 'server-only'

import { resendWelcomeMailer } from '@/features/leads/data/resend-welcome-mailer'
import { supabaseLeadRepository } from '@/features/leads/data/supabase-lead-repository'
import type { LeadRepository } from '@/features/leads/types/lead-repository'
import type { WelcomeMailer } from '@/features/leads/types/welcome-mailer'

/**
 * Composition root de servidor. Sair do Supabase para um Postgres próprio é
 * trocar uma linha aqui; sair do Resend, a outra.
 */
export const leadRepository: LeadRepository = supabaseLeadRepository
export const welcomeMailer: WelcomeMailer = resendWelcomeMailer
