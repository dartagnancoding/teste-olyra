export const ORIGINS = [
  'Instagram',
  'Site',
  'Indicação',
  'Feira',
  'Google',
  'Outro',
] as const

export type Origin = (typeof ORIGINS)[number]

export type Lead = {
  id: string
  name: string
  email: string
  origin: string
  welcome_sent_at: string | null
  created_at: string
}

export type NewLead = {
  name: string
  email: string
  origin: Origin
}
