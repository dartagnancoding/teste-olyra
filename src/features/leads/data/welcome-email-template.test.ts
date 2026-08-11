import { describe, expect, it } from 'vitest'

import {
  welcomeHtml,
  welcomeSubject,
  welcomeText,
} from '@/features/leads/data/welcome-email-template'

describe('welcomeSubject', () => {
  it('traz o nome do lead no assunto', () => {
    expect(welcomeSubject('Mariana')).toBe('Bem-vindo à Olyra, Mariana!')
  })
})

describe('welcomeText', () => {
  it('saúda o lead pelo nome', () => {
    expect(welcomeText('Mariana')).toContain('Olá, Mariana!')
  })

  it('não carrega marcação — é a versão para clientes sem HTML', () => {
    expect(welcomeText('Mariana')).not.toMatch(/<[a-z]/i)
  })
})

describe('welcomeHtml', () => {
  it('saúda o lead pelo nome', () => {
    expect(welcomeHtml('Mariana')).toContain('Olá, Mariana!')
  })

  it('preserva acento no nome', () => {
    expect(welcomeHtml('Letícia')).toContain('Olá, Letícia!')
  })

  /**
   * O nome vem de um formulário público e é interpolado direto no HTML. Sem
   * escape, um lead chamado `<script>` viraria script executável na caixa de
   * quem recebe — e, agora, também na prévia dentro do painel.
   */
  it('escapa marcação vinda do nome do lead', () => {
    const html = welcomeHtml('<script>alert(1)</script>')

    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })

  it('escapa aspas, que fechariam um atributo de estilo inline', () => {
    expect(welcomeHtml('Ana" style="x')).toContain('&quot;')
  })
})
