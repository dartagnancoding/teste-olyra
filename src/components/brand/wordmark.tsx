import { cn } from '@/lib/utils/cn'

type WordmarkProps = {
  className?: string
}

export function Wordmark({ className }: WordmarkProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="size-5 shrink-0 text-forest"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 21V10.5" />
        <path d="M12 13.5C12 8.8 15.4 5 19.5 4.5c.4 4.6-2.8 8.6-7.5 9Z" />
        <path d="M12 16.5C12 13 9.6 10.2 6.5 9.8c-.3 3.4 2.1 6.4 5.5 6.7Z" />
      </svg>
      <span className="font-display text-xl leading-none font-semibold text-forest-deep">
        Olyra
      </span>
    </span>
  )
}
