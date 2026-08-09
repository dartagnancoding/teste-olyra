const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'America/Sao_Paulo',
})

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate)

  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts.at(0)?.charAt(0) ?? ''
  const last = parts.length > 1 ? (parts.at(-1)?.charAt(0) ?? '') : ''

  return (first + last).toUpperCase() || '?'
}
