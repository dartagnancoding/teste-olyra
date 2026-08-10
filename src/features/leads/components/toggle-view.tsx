'use client'

import { cn } from '@/lib/utils/cn'

export type ViewType = 'table' | 'card'

type ToggleViewProps = {
  value: ViewType
  onChange: (view: ViewType) => void
}

const OPTIONS: Array<{ value: ViewType; label: string; icon: React.ReactNode }> = [
  {
    value: 'table',
    label: 'Ver em lista',
    icon: (
      <>
        <path d="M2.5 4h11M2.5 8h11M2.5 12h11" />
      </>
    ),
  },
  {
    value: 'card',
    label: 'Ver em cards',
    icon: (
      <>
        <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" />
        <rect x="9" y="2.5" width="4.5" height="4.5" rx="1" />
        <rect x="2.5" y="9" width="4.5" height="4.5" rx="1" />
        <rect x="9" y="9" width="4.5" height="4.5" rx="1" />
      </>
    ),
  },
]

/**
 * Alterna lista e cards na mesma tela. `aria-pressed` em vez de duas rotas: a
 * visualização é preferência de exibição do mesmo dado, não outro lugar da
 * aplicação — por isso também saiu da navegação do header.
 */
export function ToggleView({ value, onChange }: ToggleViewProps) {
  return (
    <div
      role="group"
      aria-label="Modo de visualização"
      className="flex h-11 shrink-0 items-center gap-1 rounded-md border border-border bg-surface p-1"
    >
      {OPTIONS.map((option) => {
        const isActive = value === option.value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            aria-label={option.label}
            title={option.label}
            className={cn(
              'inline-flex size-9 items-center justify-center rounded-sm transition-colors duration-150 ease-out',
              isActive
                ? 'bg-sage-soft text-forest'
                : 'text-text-muted hover:bg-sage-soft hover:text-forest',
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
              {option.icon}
            </svg>
          </button>
        )
      })}
    </div>
  )
}
