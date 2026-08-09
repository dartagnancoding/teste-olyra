import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils/cn'

const button = cva(
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-cream hover:bg-primary-hover',
        ghost: 'bg-transparent text-text hover:bg-sage-soft',
        outline:
          'border border-border bg-surface text-text hover:border-sage hover:bg-sage-soft',
        danger: 'bg-error text-cream hover:opacity-90',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-5 text-base',
      },
      block: {
        true: 'w-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type ButtonProps = VariantProps<typeof button> &
  React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ variant, size, block, className, ...rest }: ButtonProps) {
  return <button className={cn(button({ variant, size, block }), className)} {...rest} />
}
