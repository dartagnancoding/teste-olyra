/**
 * Leitura de variáveis de ambiente com falha explícita.
 *
 * O acesso é feito sob demanda (e não em um objeto congelado no import) porque
 * o build do Next avalia módulos sem necessariamente ter o ambiente completo;
 * quebrar só no momento do uso dá uma mensagem melhor que um build vermelho.
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

/**
 * Variável cuja ausência é uma configuração válida, e não um erro.
 *
 * Devolve `null` em vez de string vazia para que o chamador seja obrigado a
 * decidir o que fazer — `''` passaria despercebido num `if` e viraria bug
 * silencioso.
 */
export function optionalEnv(name: string): string | null {
  const value = process.env[name]?.trim()

  return value ? value : null
}
