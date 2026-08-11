import { describe, expect, it } from 'vitest'

import { formatDate, getInitials } from '@/lib/utils/format'

describe('formatação de data', () => {
  it('formata no padrão brasileiro', () => {
    expect(formatDate('2026-01-09T12:00:00.000Z')).toBe('09/01/2026')
  })

  it('usa o fuso de São Paulo, não o da máquina', () => {
    // Sem o timeZone fixo, o mesmo lead mostraria datas diferentes para o
    // servidor (UTC no Netlify) e para o navegador do usuário.
    expect(formatDate('2026-01-10T02:00:00.000Z')).toBe('09/01/2026')
  })

  it('degrada para travessão em vez de "Invalid Date"', () => {
    expect(formatDate('não é data')).toBe('—')
    expect(formatDate('')).toBe('—')
  })
})

describe('iniciais', () => {
  it('usa primeiro e último nome', () => {
    expect(getInitials('Mariana Costa')).toBe('MC')
    expect(getInitials('Ana Paula de Souza Lima')).toBe('AL')
  })

  it('repete nada quando só há um nome', () => {
    expect(getInitials('Mariana')).toBe('M')
  })

  it('ignora espaço extra', () => {
    expect(getInitials('  Mariana   Costa  ')).toBe('MC')
  })

  it('cai para "?" quando não sobra letra', () => {
    // O avatar tem que renderizar de qualquer jeito; string vazia deixaria um
    // círculo mudo no lugar.
    expect(getInitials('')).toBe('?')
    expect(getInitials('   ')).toBe('?')
  })
})
