'use client'

import { useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { LeadForm } from '@/features/leads/components/lead-form'
import type { Lead } from '@/features/leads/types/lead'

type NewLeadButtonProps = {
  onCreated: (lead: Lead) => void
}

/**
 * Dono do estado de abertura do modal. Fica ao lado da busca para que o
 * cadastro seja uma ação da lista, e não uma coluna competindo com ela.
 */
export function NewLeadButton({ onCreated }: NewLeadButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const close = useCallback(() => setIsOpen(false), [])

  function handleCreated(lead: Lead) {
    onCreated(lead)
    close()
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="sm:w-auto">
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
