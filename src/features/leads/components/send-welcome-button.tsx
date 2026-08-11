'use client'

import { useSendWelcome } from '@/features/leads/hooks/use-send-welcome'
import type { Lead } from '@/features/leads/types/lead'
import { cn } from '@/lib/utils/cn'

type SendWelcomeButtonProps = {
  lead: Lead
  onSent: (lead: Lead) => void
}

export function SendWelcomeButton({ lead, onSent }: SendWelcomeButtonProps) {
  const { send, isSending, error, alreadySent } = useSendWelcome(lead, onSent)

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={send}
        disabled={alreadySent || isSending}
        aria-label={
          alreadySent
            ? `Boas-vindas já enviadas para ${lead.name}`
            : `Enviar boas-vindas para ${lead.name}`
        }
        title={alreadySent ? 'Boas-vindas já enviadas' : 'Enviar boas-vindas'}
        className={cn(
          'inline-flex size-8 items-center justify-center rounded-sm border transition-colors duration-150 ease-out',
          alreadySent
            ? 'cursor-not-allowed border-transparent text-text-muted/50'
            : 'border-border text-text-muted hover:border-sage hover:bg-sage-soft hover:text-forest',
          isSending && 'cursor-wait opacity-60',
        )}
      >
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2L7.2 8.8" />
          <path d="M14 2l-4.3 12-2.5-5.2L2 6.3 14 2Z" />
        </svg>
      </button>

      {error && (
        <span role="alert" className="max-w-[24ch] text-xs text-error">
          {error}
        </span>
      )}
    </span>
  )
}
