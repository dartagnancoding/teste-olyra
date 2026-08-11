import { z } from 'zod'

export const loginSchema = z.object({
  user: z.string().min(1, 'Informe o usuário'),
  password: z.string().min(1, 'Informe a senha'),
})

export type LoginInput = z.infer<typeof loginSchema>

export type LoginResult = { ok: true } | { ok: false; message: string }

/** Trocar env por tabela de usuários com hash não sai de `data`. */
export type CredentialsChecker = {
  matches(user: string, password: string): boolean
  /** É este valor que a sessão assina. */
  currentUser(): string
}

/** Cookie assinado hoje; banco ou Redis não sairia de `data`. */
export type SessionStore = {
  create(user: string): Promise<void>
  destroy(): Promise<void>
  isValid(user: string): Promise<boolean>
}
