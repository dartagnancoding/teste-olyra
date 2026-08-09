'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { loginSchema, type LoginInput } from '@/features/auth/types/auth'

export function LoginForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { user: '', password: '' },
  })

  async function onSubmit(values: LoginInput) {
    setServerError(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const data: unknown = await response.json().catch(() => null)
        const message =
          data && typeof data === 'object' && 'error' in data
            ? String(data.error)
            : 'Não foi possível entrar. Tente novamente.'

        setServerError(message)
        return
      }

      router.replace('/crm')
      router.refresh()
    } catch {
      setServerError('Falha de conexão. Verifique sua internet e tente de novo.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <Field label="Usuário" htmlFor="user" error={errors.user?.message}>
        <Input
          id="user"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          invalid={Boolean(errors.user)}
          aria-describedby={errors.user ? 'user-error' : undefined}
          {...register('user')}
        />
      </Field>

      <Field label="Senha" htmlFor="password" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'password-error' : undefined}
          {...register('password')}
        />
      </Field>

      {serverError && (
        <p
          role="alert"
          className="rounded-md bg-error-soft px-3 py-2 text-sm text-error"
        >
          {serverError}
        </p>
      )}

      <Button type="submit" block disabled={isSubmitting}>
        {isSubmitting ? 'Entrando…' : 'Entrar'}
      </Button>
    </form>
  )
}
