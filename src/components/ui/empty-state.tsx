type EmptyStateProps = {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="size-8 text-sage"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 21V10.5" />
        <path d="M12 13.5C12 8.8 15.4 5 19.5 4.5c.4 4.6-2.8 8.6-7.5 9Z" />
        <path d="M12 16.5C12 13 9.6 10.2 6.5 9.8c-.3 3.4 2.1 6.4 5.5 6.7Z" />
      </svg>
      <p className="font-display text-lg font-semibold text-text">{title}</p>
      <p className="max-w-[45ch] text-base text-text-muted">{description}</p>
    </div>
  )
}
