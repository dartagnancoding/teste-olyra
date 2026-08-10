import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { DemoCredentials } from '@/features/auth/components/demo-credentials'
import { LoginForm } from '@/features/auth/components/login-form'
import { Wordmark } from '@/components/brand/wordmark'
import { Card } from '@/components/ui/card'
import { isAuthenticated } from '@/features/auth/application/session'

export const metadata: Metadata = {
  title: 'Entrar — Olyra',
}

export default async function LoginPage() {
  if (await isAuthenticated()) redirect('/crm')

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Wordmark className="h-10 w-auto" priority />
          <p className="text-base text-text-muted">Painel de leads</p>
        </div>

        <Card className="p-8">
          <LoginForm />
        </Card>

        <DemoCredentials />

        <p className="mt-8 text-center text-sm text-text-muted">
          Acesso restrito à equipe Olyra.
        </p>
      </div>
    </main>
  )
}
