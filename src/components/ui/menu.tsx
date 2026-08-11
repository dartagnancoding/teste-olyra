'use client'

import { useCallback, useId, useRef, useState } from 'react'

import { cn } from '@/lib/utils/cn'

type MenuProps = {
  label: string
  children: (close: () => void) => React.ReactNode
}

/**
 * `popover` nativo, não `absolute`: a tabela vive num card com
 * `overflow-hidden`, que recortaria o menu. A top layer escapa disso e ainda
 * traz dispensa por clique-fora e Escape de graça. A posição é medida na
 * abertura porque CSS anchor ainda não é uniforme entre navegadores.
 */

const GAP = 6
const MARGIN = 8

export function Menu({ label, children }: MenuProps) {
  const id = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ top: number; right: number }>()

  const close = useCallback(() => popoverRef.current?.hidePopover(), [])

  function handleToggle(event: React.ToggleEvent<HTMLDivElement>) {
    if (event.newState !== 'open') return

    const trigger = triggerRef.current?.getBoundingClientRect()
    const menu = popoverRef.current?.getBoundingClientRect()

    if (!trigger || !menu) return

    // Vira para cima quando não cabe embaixo: na última linha da tabela o menu
    // passava da dobra e escondia "Excluir lead", e a top layer não ganha
    // rolagem para alcançá-lo.
    const espacoAbaixo = window.innerHeight - trigger.bottom - MARGIN
    const espacoAcima = trigger.top - MARGIN
    const cabeAbaixo = espacoAbaixo >= menu.height + GAP

    const top =
      cabeAbaixo || espacoAbaixo >= espacoAcima
        ? Math.min(trigger.bottom + GAP, window.innerHeight - menu.height - MARGIN)
        : Math.max(MARGIN, trigger.top - menu.height - GAP)

    setPosition({
      top: Math.max(MARGIN, top),
      right: Math.max(MARGIN, window.innerWidth - trigger.right),
    })
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        popoverTarget={id}
        aria-label={label}
        className="inline-flex size-9 items-center justify-center rounded-md text-text-muted transition-colors duration-150 ease-out hover:bg-sage-soft hover:text-forest"
      >
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="size-4"
          fill="currentColor"
        >
          <circle cx="8" cy="3" r="1.4" />
          <circle cx="8" cy="8" r="1.4" />
          <circle cx="8" cy="13" r="1.4" />
        </svg>
      </button>

      <div
        ref={popoverRef}
        id={id}
        popover="auto"
        role="menu"
        aria-label={label}
        onToggle={handleToggle}
        style={position ? { top: position.top, right: position.right } : undefined}
        className={cn(
          'fixed m-0 min-w-52 rounded-md border border-border bg-surface p-1.5 text-text shadow-raised',
          'inset-auto',
        )}
      >
        {children(close)}
      </div>
    </>
  )
}

type MenuItemProps = {
  onClick: () => void
  danger?: boolean
  disabled?: boolean
  children: React.ReactNode
}

export function MenuItem({ onClick, danger, disabled, children }: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-left text-sm transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50',
        danger
          ? 'text-error hover:bg-error-soft'
          : 'text-text hover:bg-sage-soft hover:text-forest',
      )}
    >
      {children}
    </button>
  )
}
