import 'server-only'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { requireEnv } from '@/lib/env'

let client: SupabaseClient | null = null

/**
 * A secret key carrega `BYPASSRLS`, então só pode existir no servidor:
 * `server-only` transforma um import em componente client em erro de build, e
 * o Supabase ainda recusa a chave com 401 se ela partir de um browser.
 *
 * Criação preguiçosa para o build do Next não exigir os segredos.
 */
export function getSupabase(): SupabaseClient {
  client ??= createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SECRET_KEY'),
    { auth: { persistSession: false } },
  )

  return client
}
