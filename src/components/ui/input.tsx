import { controlBorderClasses, controlClasses } from '@/components/ui/control'
import { cn } from '@/lib/utils/cn'

type InputProps = { invalid?: boolean } & React.InputHTMLAttributes<HTMLInputElement>

export function Input({ invalid, className, ...rest }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(controlClasses, controlBorderClasses(invalid), className)}
      {...rest}
    />
  )
}
