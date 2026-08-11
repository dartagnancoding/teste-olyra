import { getDemoCredentials } from '@/features/auth/application/session'

/**
 * Escolha de escopo: painel de usuário único, e quem avalia precisa entrar sem
 * receber a senha por fora. **Em uso real, remover da tela de login.**
 */
export function DemoCredentials() {
  const credentials = getDemoCredentials()

  if (!credentials) return null

  const { user, password } = credentials

  return (
    <section
      aria-label="Credenciais de demonstração"
      className="mt-6 rounded-md border border-sage bg-sage-soft px-5 py-4"
    >
      <p className="flex items-center gap-2 text-sm font-medium text-forest">
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="size-4 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="5.75" cy="10.25" r="2.75" />
          <path d="M7.7 8.3L13 3M11.2 4.8l1.3 1.3" />
        </svg>
        Acesso de demonstração
      </p>

      <dl className="mt-3 flex flex-col gap-2 text-sm">
        <div className="flex items-center gap-3">
          <dt className="w-16 shrink-0 text-text-muted">Usuário</dt>
          <dd className="rounded-sm border border-border bg-surface px-2 py-1 font-medium break-all">
            {user}
          </dd>
        </div>
        <div className="flex items-center gap-3">
          <dt className="w-16 shrink-0 text-text-muted">Senha</dt>
          <dd className="rounded-sm border border-border bg-surface px-2 py-1 font-medium break-all">
            {password}
          </dd>
        </div>
      </dl>
    </section>
  )
}
