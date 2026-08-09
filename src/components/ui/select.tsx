import { controlBorderClasses, controlClasses } from '@/components/ui/control'
import { cn } from '@/lib/utils/cn'

type SelectProps = { invalid?: boolean } & React.SelectHTMLAttributes<HTMLSelectElement>

export function Select({ invalid, className, children, ...rest }: SelectProps) {
  return (
    <span className="relative block">
      <select
        aria-invalid={invalid || undefined}
        className={cn(
          controlClasses,
          controlBorderClasses(invalid),
          'appearance-none pr-10',
          className,
        )}
        {...rest}
      >
        {children}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 6l4 4 4-4" />
      </svg>
    </span>
  )
}
