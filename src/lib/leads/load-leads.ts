import 'server-only'

import { leadRepository } from '@/lib/db/leads'
import type { Lead } from '@/types/lead'

export type LeadsResult =
  | { ok: true; leads: Lead[] }
  | { ok: false; message: string }

/**
 * Falha de banco vira estado de tela, não erro 500 — o painel continua
 * navegável e o operador entende o que aconteceu.
 */
export async function loadLeads(): Promise<LeadsResult> {
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
