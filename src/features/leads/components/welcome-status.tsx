import { Badge } from '@/components/ui/badge'

type WelcomeStatusProps = {
  sentAt: string | null
}

/**
 * Compartilhado porque as duas visões diziam a mesma coisa com palavras
 * diferentes, e o texto longo do card quebrava linha a 360px — deixando os
 * cards com alturas diferentes conforme o lead já tinha recebido o email.
 */
export function WelcomeStatus({ sentAt }: WelcomeStatusProps) {
  if (!sentAt) return <span className="text-sm text-text-muted">—</span>

  return (
    <Badge tone="success">
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="size-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 8.5l3.5 3.5L13 5" />
      </svg>
      Enviado
    </Badge>
  )
}
