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
