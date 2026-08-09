import { Card } from '@/components/ui/card'

type ErrorStateProps = {
  title: string
  description: string
}

export function ErrorState({ title, description }: ErrorStateProps) {
  return (
    <Card className="border-error/40 bg-error-soft p-6">
      <p className="font-display text-lg font-semibold text-error">{title}</p>
      <p className="mt-1 max-w-[60ch] text-base text-text-muted">{description}</p>
    </Card>
  )
}
