import { Card } from '@/components/ui/card'

type ErrorStateProps = {
  title: string
  description: string
  /** Aparece discreto, para o operador relatar e casar com o log. */
  code?: string
}

export function ErrorState({ title, description, code }: ErrorStateProps) {
  return (
    <Card className="border-error/40 bg-error-soft p-6">
      <p className="font-display text-lg font-semibold text-error">{title}</p>
      <p className="mt-1 max-w-[60ch] text-base text-text-muted">{description}</p>
      {code && (
        <p className="mt-3 text-xs tracking-wide text-text-muted/80 tabular-nums">
          Código: {code}
        </p>
      )}
    </Card>
  )
}
