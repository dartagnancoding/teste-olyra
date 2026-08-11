import { describe, expect, it } from 'vitest'

import { leadSchema, sendWelcomeSchema } from '@/features/leads/types/lead-schema'

describe('validação de cadastro', () => {
  it('normaliza enquanto valida', () => {
    // O trim/lowercase acontece uma vez, aqui, e não espalhado por quem chama.
    const parsed = leadSchema.parse({
      name: '  Mariana Costa  ',
      email: '  Mariana.Costa@Exemplo.COM ',
      origin: 'Instagram',
    })

    expect(parsed).toEqual({
      name: 'Mariana Costa',
      email: 'mariana.costa@exemplo.com',
      origin: 'Instagram',
    })
  })

  it('recusa nome curto demais mesmo com espaços em volta', () => {
    expect(leadSchema.safeParse({ name: '  A  ', email: 'a@b.com', origin: 'Site' }).success).toBe(
      false,
    )
  })

  it.each(['sem-arroba', 'a@', '@exemplo.com', ''])(
    'recusa email inválido (%s)',
    (email) => {
      expect(leadSchema.safeParse({ name: 'Mariana Costa', email, origin: 'Site' }).success).toBe(
        false,
      )
    },
  )

  it('recusa origem fora da lista', () => {
    // Na escrita a origem é fechada; é o que mantém o filtro coerente.
    const result = leadSchema.safeParse({
      name: 'Mariana Costa',
      email: 'mariana@exemplo.com',
      origin: 'TikTok',
    })

    expect(result.success).toBe(false)
  })

  it('devolve a mensagem em português para o campo certo', () => {
    const result = leadSchema.safeParse({ name: 'M', email: 'nao-e-email', origin: 'Site' })

    expect(result.success).toBe(false)

    const campos = result.success ? [] : result.error.issues.map((issue) => issue.path[0])

    expect(campos).toContain('name')
    expect(campos).toContain('email')
  })
})

describe('validação de envio de boas-vindas', () => {
  it('aceita uuid', () => {
    const leadId = '3f2504e0-4f89-41d3-9a0c-0305e82c3301'

    expect(sendWelcomeSchema.parse({ leadId })).toEqual({ leadId })
  })

  it('recusa id que não é uuid', () => {
    // A action é endpoint público: chega o que mandarem, não só o que a UI manda.
    expect(sendWelcomeSchema.safeParse({ leadId: "1 OR 1=1" }).success).toBe(false)
  })
})
