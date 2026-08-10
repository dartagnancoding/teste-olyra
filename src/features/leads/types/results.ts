import type { Lead } from '@/features/leads/types/lead'

/**
 * Resultados dos casos de uso. Vivem em `types` porque atravessam a fronteira
 * servidor→client: a action devolve, o componente consome. Como são tipos puros
 * (apagados na compilação), o client nunca arrasta o módulo de servidor junto.
 *
 * Falha esperada é valor de retorno, não exceção — o componente faz `if`, não
 * `try/catch`.
 */
export type LeadsResult =
  | { ok: true; leads: Lead[] }
  | { ok: false; message: string }

export type LeadResult =
  | { ok: true; lead: Lead }
  | { ok: false; message: string }
