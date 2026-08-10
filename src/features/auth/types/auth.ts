import { z } from 'zod'

export const loginSchema = z.object({
  user: z.string().min(1, 'Informe o usuário'),
  password: z.string().min(1, 'Informe a senha'),
})

export type LoginInput = z.infer<typeof loginSchema>

export type LoginResult = { ok: true } | { ok: false; message: string }

/**
 * Porta de verificação de credencial. Hoje a implementação lê variáveis de
 * ambiente; trocar por uma tabela de usuários com hash é escrever outra
 * implementação em `data`, sem tocar na application nem nos componentes.
 */
export type CredentialsChecker = {
  matches(user: string, password: string): boolean
  /** Usuário canônico do painel — é ele que a sessão assina. */
  currentUser(): string
}

/**
 * Porta de sessão. A implementação atual é um cookie assinado; trocar por
 * sessão em banco ou Redis não sai desta pasta.
 */
export type SessionStore = {
  create(user: string): Promise<void>
  destroy(): Promise<void>
  isValid(user: string): Promise<boolean>
}
