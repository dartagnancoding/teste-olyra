import 'server-only'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { requireEnv } from '@/lib/env'

let client: SupabaseClient | null = null

/**
 * Cliente com a secret key do Supabase (`sb_secret_…`, sucessora da antiga
 * `service_role`): carrega `BYPASSRLS` e por isso só pode existir no servidor
 * (`server-only` transforma um import em componente client em erro de build).
 * O próprio Supabase recusa a chave com 401 quando a requisição vem de um
 * browser, o que fecha a mesma porta por um segundo caminho.
 *
 * A criação é preguiçosa para que o build do Next não exija os segredos —
 * eles só precisam existir quando uma requisição realmente chega.
 */
export function getSupabase(): SupabaseClient {
  client ??= createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SECRET_KEY'),
    { auth: { persistSession: false } },
  )

  return client
}
