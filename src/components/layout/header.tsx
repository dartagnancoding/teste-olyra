import Link from 'next/link'

import { Wordmark } from '@/components/brand/wordmark'
import { LogoutButton } from '@/components/layout/logout-button'

export function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-x-6 px-4 py-4 sm:px-6">
        <Link href="/crm" className="rounded-md">
          <Wordmark priority />
        </Link>

        <div className="ml-auto">
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
