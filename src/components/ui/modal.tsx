'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'

import { cn } from '@/lib/utils/cn'

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  size?: 'default' | 'wide'
  children: React.ReactNode
}

const WIDTHS = {
  default: 'w-[min(30rem,calc(100vw-2rem))]',
  wide: 'w-[min(44rem,calc(100vw-2rem))]',
} as const

/** Precisa ser maior que a transição de `.modal-dialog` em `globals.css`. */
const EXIT_MS = 260

/**
 * `<dialog>` nativo: foco preso, Escape, resto da página inerte e top layer,
 * tudo sem biblioteca.
 *
 * A animação é CSS puro (`.modal-dialog`), apoiada em `@starting-style` e
 * `transition-behavior: allow-discrete` — sem isso não há como animar a saída
 * de um elemento indo para `display: none`.
 *
 * O conteúdo desmonta ao fechar, o que devolve o formulário limpo sem ninguém
 * chamar `reset()`. A desmontagem espera a saída; imediata, o modal sairia da
 * tela já vazio.
 */
export function Modal({ open, onClose, title, size = 'default', children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const [isMounted, setIsMounted] = useState(open)

  useEffect(() => {
    const dialog = ref.current

    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    if (open) {
      setIsMounted(true)
      return
    }

    const timer = window.setTimeout(() => setIsMounted(false), EXIT_MS)

    return () => window.clearTimeout(timer)
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
      className={cn(
        'modal-dialog m-auto rounded-md border border-border bg-surface p-0 text-text shadow-raised backdrop:bg-forest-deep/40',
        WIDTHS[size],
      )}
    >
      {isMounted && (
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
