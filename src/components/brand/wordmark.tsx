import Image from 'next/image'

import { cn } from '@/lib/utils/cn'

/** Proporção do arquivo original (400×116). */
const LOGO_WIDTH = 400
const LOGO_HEIGHT = 116

type WordmarkProps = {
  className?: string
  priority?: boolean
}

/**
 * Servida do próprio projeto, não da CDN da loja: hotlink de terceiro pode
 * cair ou mudar de caminho, e a marca sumiria do painel sem aviso.
 */
export function Wordmark({ className, priority }: WordmarkProps) {
  return (
    <Image
      src="/olyra-logo.png"
      alt="Olyra"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={cn('h-7 w-auto', className)}
    />
  )
}
