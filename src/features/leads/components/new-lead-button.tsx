'use client'

import { useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { LeadForm } from '@/features/leads/components/lead-form'
import type { Lead } from '@/features/leads/types/lead'
import { cn } from '@/lib/utils/cn'

type NewLeadButtonProps = {
  onCreated: (lead: Lead) => void
  className?: string
}

export function NewLeadButton({ onCreated, className }: NewLeadButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const close = useCallback(() => setIsOpen(false), [])

  function handleCreated(lead: Lead) {
    onCreated(lead)
    close()
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className={cn('shrink-0', className)}>
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
        >
          <path d="M8 3.5v9M3.5 8h9" />
        </svg>
        Novo lead
      </Button>

      <Modal open={isOpen} onClose={close} title="Novo lead">
        <LeadForm onCreated={handleCreated} onCancel={close} />
      </Modal>
    </>
  )
}
