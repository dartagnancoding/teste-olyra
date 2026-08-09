import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils/cn'

const badge = cva(
  'inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-sm font-medium whitespace-nowrap',
  {
    variants: {
      tone: {
        sage: 'bg-sage-soft text-forest',
        success: 'bg-success-soft text-success',
        error: 'bg-error-soft text-error',
      },
    },
    defaultVariants: { tone: 'sage' },
  },
)

type BadgeProps = VariantProps<typeof badge> & React.HTMLAttributes<HTMLSpanElement>

export function Badge({ tone, className, ...rest }: BadgeProps) {
  return <span className={cn(badge({ tone }), className)} {...rest} />
}
