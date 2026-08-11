import Link from 'next/link'

import { Wordmark } from '@/components/brand/wordmark'
import { LogoutButton } from '@/components/layout/logout-button'

type HeaderProps = {
  /**
   * Ações de feature exibidas antes do botão de sair. Entram por slot para o
   * header seguir sendo chassi da aplicação, sem importar nada de `features`.
   */
  actions?: React.ReactNode
}

export function Header({ actions }: HeaderProps) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-x-2 px-4 py-4 sm:gap-x-6 sm:px-6">
        <Link href="/crm" className="rounded-md">
          <Wordmark priority />
        </Link>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {actions}
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
