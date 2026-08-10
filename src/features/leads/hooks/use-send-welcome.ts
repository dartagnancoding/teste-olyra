'use client'

import { useState } from 'react'

import { sendWelcomeAction } from '@/features/leads/actions'
import type { Lead } from '@/features/leads/types/lead'

/**
 * Envio de boas-vindas isolado do componente porque agora existem dois gatilhos
 * para a mesma ação: o botão rápido na coluna de status e o item do menu. A
 * regra de "já enviado não reenvia" mora aqui, num lugar só.
 */
export function useSendWelcome(lead: Lead, onUpdated: (lead: Lead) => void) {
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const alreadySent = Boolean(lead.welcome_sent_at)

  async function send() {
    if (alreadySent || isSending) return

    setIsSending(true)
    setError(null)

    const result = await sendWelcomeAction(lead.id)

    if (result.ok) onUpdated(result.lead)
    else setError(result.message)

    setIsSending(false)
  }

  return { send, isSending, error, alreadySent }
}
