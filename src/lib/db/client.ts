import 'server-only'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { requireEnv } from '@/lib/env'

let client: SupabaseClient | null = null

/**
 * Cliente com service role: ignora RLS e por isso só pode existir no servidor
 * (`server-only` transforma um import em componente client em erro de build).
 *
 * A criação é preguiçosa para que o build do Next não exija os segredos —
 * eles só precisam existir quando uma requisição realmente chega.
 */
export function getDb(): SupabaseClient {
  client ??= createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { persistSession: false } },
  )

  return client
}
