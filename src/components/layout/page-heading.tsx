type PageHeadingProps = {
  title: string
  description: string
}

export function PageHeading({ title, description }: PageHeadingProps) {
  return (
    <div className="mb-10 flex flex-col gap-2">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h1>
      <p className="max-w-[60ch] text-base text-text-muted">{description}</p>
    </div>
  )
}
