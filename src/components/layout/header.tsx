import Link from 'next/link'

import { Wordmark } from '@/components/brand/wordmark'
import { LogoutButton } from '@/components/layout/logout-button'
import { NavLink } from '@/components/layout/nav-link'

export function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4">
        <Link href="/crm" className="rounded-md">
          <Wordmark priority />
        </Link>

        <nav aria-label="Navegação principal" className="order-3 flex w-full gap-1 sm:order-none sm:w-auto">
          <NavLink href="/crm">Lista</NavLink>
          <NavLink href="/cards">Cards</NavLink>
        </nav>

        <div className="ml-auto">
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
