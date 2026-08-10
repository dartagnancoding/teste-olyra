'use client'

import { useCallback, useEffect, useId, useRef } from 'react'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

/**
 * Modal sobre o `<dialog>` nativo, em vez de uma `<div>` com `position: fixed`.
 *
 * O elemento nativo já resolve, sem biblioteca e sem código nosso: prende o
 * foco dentro do diálogo, fecha no Escape, torna o resto da página inerte para
 * leitor de tela e renderiza na top layer (nenhum `z-index` compete).
 *
 * O conteúdo só é montado enquanto aberto — assim o formulário volta limpo a
 * cada abertura, sem ninguém precisar chamar `reset()`.
 */
export function Modal({ open, onClose, title, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current

    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // `close` cobre Escape e o botão de fechar — um caminho só de volta ao pai.
  useEffect(() => {
    const dialog = ref.current

    if (!dialog) return

    dialog.addEventListener('close', onClose)

    return () => dialog.removeEventListener('close', onClose)
  }, [onClose])

  // No backdrop, o alvo do clique é o próprio `<dialog>`; no conteúdo, não é.
  const handleClick = useCallback((event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === ref.current) ref.current?.close()
  }, [])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClick={handleClick}
      className="m-auto w-[min(30rem,calc(100vw-2rem))] rounded-md border border-border bg-surface p-0 text-text shadow-raised backdrop:bg-forest-deep/40"
    >
      {open && (
        <div className="p-6 sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <h2 id={titleId} className="font-display text-xl font-semibold">
              {title}
            </h2>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Fechar"
              className="-mt-1 -mr-1 inline-flex size-9 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors duration-150 ease-out hover:bg-sage-soft hover:text-forest"
            >
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
              >
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  )
}
