'use client'

import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { leadGateway } from '@/features/leads/dependencies'
import type { Lead } from '@/features/leads/types/lead'

type SendWelcomeButtonProps = {
  lead: Lead
  onSent: (lead: Lead) => void
  block?: boolean
}

export function SendWelcomeButton({ lead, onSent, block }: SendWelcomeButtonProps) {
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (lead.welcome_sent_at) {
    return (
      <Badge tone="success">
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="size-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 8.5l3.5 3.5L13 5" />
        </svg>
        Enviado
      </Badge>
    )
  }

  async function handleSend() {
    setIsSending(true)
    setError(null)

    try {
      onSent(await leadGateway.sendWelcome(lead.id))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Erro inesperado.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className={block ? 'w-full' : undefined}>
      <Button
        variant="outline"
        size="sm"
        block={block}
        onClick={handleSend}
        disabled={isSending}
      >
        {isSending ? 'Enviando…' : 'Enviar boas-vindas'}
      </Button>
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-error">
          {error}
        </p>
      )}
    </div>
  )
}
