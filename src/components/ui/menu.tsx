'use client'

import { useCallback, useId, useRef, useState } from 'react'

import { cn } from '@/lib/utils/cn'

type MenuProps = {
  label: string
  children: (close: () => void) => React.ReactNode
}

/**
 * Menu de ações sobre a API `popover` nativa.
 *
 * A escolha resolve dois problemas de uma vez. O primeiro é recorte: a tabela
 * vive dentro de um card com `overflow-hidden`, e um dropdown posicionado por
 * `absolute` seria cortado — `popover` renderiza na top layer, fora do fluxo.
 * O segundo é dispensa: fechar ao clicar fora e no Escape vem do navegador,
 * sem listener global nosso.
 *
 * A posição é calculada na abertura porque o ancoramento nativo (CSS anchor)
 * ainda não é uniforme entre navegadores — e é na abertura que dá para medir o
 * menu, já que a top layer o renderiza antes do evento `toggle`.
 */

/** Respiro entre o gatilho e o menu. */
const GAP = 6
/** Distância mínima da borda da janela. */
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

    // Abaixo do gatilho é o padrão. Mas na última linha da tabela o menu
    // passava da dobra e escondia "Excluir lead": o popover vive na top layer,
    // então a página não ganha rolagem para alcançá-lo. Quando não cabe
    // embaixo e sobra mais espaço em cima, ele vira para cima.
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
