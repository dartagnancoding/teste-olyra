import { cn } from '@/lib/utils/cn'

type CardProps = { as?: 'div' | 'article' | 'section' } & React.HTMLAttributes<HTMLDivElement>

export function Card({ as: Tag = 'div', className, ...rest }: CardProps) {
  return (
    <Tag
      className={cn(
        'rounded-md border border-border bg-surface shadow-soft',
        className,
      )}
      {...rest}
    />
  )
}
