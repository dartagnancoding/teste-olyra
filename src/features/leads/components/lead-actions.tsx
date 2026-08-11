'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Menu, MenuItem } from '@/components/ui/menu'
import { Modal } from '@/components/ui/modal'
import { deleteLeadAction } from '@/features/leads/actions'
import { useSendWelcome } from '@/features/leads/hooks/use-send-welcome'
import type { Lead } from '@/features/leads/types/lead'

type LeadActionsProps = {
  lead: Lead
  onUpdated: (lead: Lead) => void
  onRemoved: (id: string) => void
}

export function LeadActions({ lead, onUpdated, onRemoved }: LeadActionsProps) {
  const [busy, setBusy] = useState<'deleting' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const welcome = useSendWelcome(lead, onUpdated)

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(lead.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('O navegador bloqueou a cópia. Selecione o email manualmente.')
    }
  }

  async function handleDelete() {
    setBusy('deleting')
    setError(null)

    const result = await deleteLeadAction(lead.id)

    if (result.ok) {
      onRemoved(lead.id)
      return
    }

    setError(result.message)
    setBusy(null)
    setConfirmingDelete(false)
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {welcome.isSending && <span className="text-sm text-text-muted">Enviando…</span>}

      {copied && (
        <span role="status" className="text-sm text-success">
          Email copiado
        </span>
      )}

      {(error ?? welcome.error) && (
        <span role="alert" className="max-w-[28ch] text-sm text-error">
          {error ?? welcome.error}
        </span>
      )}

      <Menu label={`Ações de ${lead.name}`}>
        {(close) => (
          <>
            <MenuItem
              disabled={welcome.alreadySent || welcome.isSending || busy !== null}
              onClick={() => {
                close()
                void welcome.send()
              }}
            >
              {welcome.alreadySent ? 'Boas-vindas já enviadas' : 'Enviar boas-vindas'}
            </MenuItem>

            <MenuItem
              onClick={() => {
                close()
                void handleCopyEmail()
              }}
            >
              Copiar email
            </MenuItem>

            <MenuItem
              onClick={() => {
                close()
                window.location.href = `mailto:${lead.email}`
              }}
            >
              Escrever email
            </MenuItem>

            <MenuItem
              danger
              disabled={busy !== null}
              onClick={() => {
                close()
                setConfirmingDelete(true)
              }}
            >
              Excluir lead
            </MenuItem>
          </>
        )}
      </Menu>

      <Modal
        open={confirmingDelete}
        onClose={() => setConfirmingDelete(false)}
        title="Excluir lead"
      >
        <p className="text-base text-text-muted">
          <strong className="font-medium text-text">{lead.name}</strong> será removido
          definitivamente. Não há como desfazer.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={() => setConfirmingDelete(false)}
            disabled={busy === 'deleting'}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={busy === 'deleting'}>
            {busy === 'deleting' ? 'Excluindo…' : 'Excluir'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
