'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { createLeadAction } from '@/features/leads/actions'
import { leadSchema, type LeadInput } from '@/features/leads/types/lead-schema'
import type { Failure } from '@/features/leads/types/results'
import { ORIGINS, type Lead } from '@/features/leads/types/lead'

type LeadFormProps = {
  onCreated: (lead: Lead) => void
  onCancel: () => void
}

/** Falhas que o operador não resolve editando um campo — aí o código ajuda. */
const OPAQUE_CODES = new Set(['DB_UNREACHABLE', 'DB_SCHEMA_MISMATCH', 'DB_UNKNOWN'])

export function LeadForm({ onCreated, onCancel }: LeadFormProps) {
  const [failure, setFailure] = useState<Failure | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', origin: 'Instagram' },
  })

  async function onSubmit(values: LeadInput) {
    setFailure(null)

    const result = await createLeadAction(values)

    // Em caso de erro o modal fica aberto de propósito: o que foi digitado
    // continua na tela e dá para corrigir sem redigitar.
    if (!result.ok) {
      setFailure(result)
      return
    }

    onCreated(result.lead)
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

      {failure && (
        <p role="alert" className="rounded-md bg-error-soft px-3 py-2 text-sm text-error">
          {failure.message}
          {OPAQUE_CODES.has(failure.code) && (
            <span className="mt-1 block text-xs text-error/80">
              Código: {failure.code}
            </span>
          )}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Cadastrando…' : 'Cadastrar lead'}
        </Button>
      </div>
    </form>
  )
}
