import 'server-only'

import { resendWelcomeMailer } from '@/features/leads/data/resend-welcome-mailer'
import { supabaseLeadRepository } from '@/features/leads/data/supabase-lead-repository'
import type { LeadRepository } from '@/features/leads/types/lead-repository'
import type { WelcomeMailer } from '@/features/leads/types/welcome-mailer'

/** Trocar Supabase ou Resend é trocar uma linha daqui. */
export const leadRepository: LeadRepository = supabaseLeadRepository
export const welcomeMailer: WelcomeMailer = resendWelcomeMailer
