/** Base visual compartilhada entre input e select, para que os dois nunca divirjam. */
export const controlClasses =
  'h-11 w-full rounded-md border bg-surface px-3 text-base text-text transition-colors duration-150 ease-out placeholder:text-text-muted disabled:cursor-not-allowed disabled:opacity-50'

export function controlBorderClasses(invalid?: boolean): string {
  return invalid ? 'border-error' : 'border-border hover:border-sage'
}
