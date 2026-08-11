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

describe('tarja de envio demonstrativo', () => {
  const notice = { name: 'João Pedro', email: 'joao@exemplo.com' }

  it('não aparece quando não há desvio', () => {
    expect(welcomeHtml('Mariana')).not.toContain('Envio demonstrativo')
    expect(welcomeText('Mariana')).not.toContain('ENVIO DEMONSTRATIVO')
  })

  it('nomeia o destinatário original no HTML', () => {
    const html = welcomeHtml('João Pedro', notice)

    expect(html).toContain('Envio demonstrativo')
    expect(html).toContain('joao@exemplo.com')
  })

  it('nomeia o destinatário original na versão texto', () => {
    const text = welcomeText('João Pedro', notice)

    expect(text).toContain('joao@exemplo.com')
    expect(text.indexOf('joao@exemplo.com')).toBeLessThan(text.indexOf('Olá,'))
  })

  /**
   * O email do destinatário vem do banco, ou seja, de um formulário público.
   * Na tarja ele entra no HTML igual ao nome — e precisa do mesmo escape.
   */
  it('escapa marcação vinda do destinatário original', () => {
    const html = welcomeHtml('Mariana', {
      name: '<img onerror=alert(1)>',
      email: 'a"><script>alert(1)</script>@x.com',
    })

    expect(html).not.toContain('<script>')
    expect(html).not.toContain('<img onerror')
  })

  it('mantém a mensagem da Olyra intacta abaixo da tarja', () => {
    expect(welcomeHtml('João Pedro', notice)).toContain('Olá, João Pedro!')
  })
})
