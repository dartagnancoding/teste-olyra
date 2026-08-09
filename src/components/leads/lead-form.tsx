'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { createLead } from '@/lib/leads/api'
import { leadSchema, type LeadInput } from '@/lib/validations'
import { ORIGINS, type Lead } from '@/types/lead'

type LeadFormProps = {
  onCreated: (lead: Lead) => void
}

export function LeadForm({ onCreated }: LeadFormProps) {
  const [status, setStatus] = useState<{ tone: 'success' | 'error'; message: string } | null>(
    null,
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', origin: 'Instagram' },
  })

  async function onSubmit(values: LeadInput) {
    setStatus(null)

    try {
      onCreated(await createLead(values))
      reset()
      setStatus({ tone: 'success', message: 'Lead cadastrado com sucesso.' })
    } catch (error) {
      setStatus({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Erro inesperado.',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <Field label="Nome" htmlFor="name" error={errors.name?.message}>
        <Input
          id="name"
          autoComplete="name"
          placeholder="Mariana Costa"
          invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
          {...register('name')}
        />
      </Field>

      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="mariana@exemplo.com"
          invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
        />
      </Field>

      <Field label="Origem" htmlFor="origin" error={errors.origin?.message}>
        <Select
          id="origin"
          invalid={Boolean(errors.origin)}
          aria-describedby={errors.origin ? 'origin-error' : undefined}
          {...register('origin')}
        >
          {ORIGINS.map((origin) => (
            <option key={origin} value={origin}>
              {origin}
            </option>
          ))}
        </Select>
      </Field>

      <Button type="submit" block disabled={isSubmitting}>
        {isSubmitting ? 'Cadastrando…' : 'Cadastrar lead'}
      </Button>

      {status && (
        <p
          role="status"
          className={
            status.tone === 'success'
              ? 'rounded-md bg-success-soft px-3 py-2 text-sm text-success'
              : 'rounded-md bg-error-soft px-3 py-2 text-sm text-error'
          }
        >
          {status.message}
        </p>
      )}
    </form>
  )
}
