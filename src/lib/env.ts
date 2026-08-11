/**
 * Lido sob demanda, não num objeto congelado no import: o build do Next avalia
 * módulos sem ter o ambiente completo, e quebrar no uso dá mensagem melhor que
 * um build vermelho.
 */
export function requireEnv(name: string): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(
      `Variável de ambiente ausente: ${name}. Confira o .env.local (ou o painel do Netlify).`,
    )
  }

  return value
}

/** Ausência é configuração válida. `null` e não `''`, que passaria num `if`. */
export function optionalEnv(name: string): string | null {
  const value = process.env[name]?.trim()

  return value ? value : null
}
