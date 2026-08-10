import 'server-only'

import { leadRepository } from '@/features/leads/dependencies.server'
import type { LeadsResult } from '@/features/leads/types/results'

/**
 * Falha de banco vira estado de tela, não erro 500 — o painel continua
 * navegável e o operador entende o que aconteceu.
 */
export async function getLeads(): Promise<LeadsResult> {
  try {
    return { ok: true, leads: await leadRepository.getAll() }
  } catch (error) {
    console.error('[leads] falha ao carregar', error)

    return {
      ok: false,
      message:
        'Não foi possível conectar ao banco de dados. Confira as variáveis do Supabase e recarregue a página.',
    }
  }
}
