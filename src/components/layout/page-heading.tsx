type PageHeadingProps = {
  title: string
  description: string
}

/**
 * A 360px o cabeçalho competia com a lista: título grande, três linhas de
 * descrição e 40px de respiro empurravam o primeiro lead para fora da tela.
 * No celular ele encolhe; a partir de `sm` volta ao tamanho cheio.
 */
export function PageHeading({ title, description }: PageHeadingProps) {
  return (
    <div className="mb-6 flex flex-col gap-1.5 sm:mb-10 sm:gap-2">
      <h1 className="font-display text-2xl font-semibold sm:text-4xl">{title}</h1>
      <p className="max-w-[60ch] text-sm text-text-muted sm:text-base">{description}</p>
    </div>
  )
}
