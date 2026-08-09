'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils/cn'

type NavLinkProps = {
  href: string
  children: React.ReactNode
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'inline-flex h-11 items-center rounded-md px-3 text-base transition-colors duration-150 ease-out',
        isActive
          ? 'bg-sage-soft font-medium text-forest'
          : 'text-text-muted hover:bg-sage-soft hover:text-forest',
      )}
    >
      {children}
    </Link>
  )
}
