import Image from 'next/image'

import { cn } from '@/lib/utils/cn'

/** Proporção do arquivo original (400×116) — trava o aspecto ao mudar a altura. */
const LOGO_WIDTH = 400
const LOGO_HEIGHT = 116

type WordmarkProps = {
  /** Controle a altura por classe (`h-7`, `h-10`…); a largura acompanha. */
  className?: string
  priority?: boolean
}

/**
 * Logo oficial da Olyra, servida do próprio projeto e não da CDN da loja —
 * hotlink de terceiro é dependência que pode cair, mudar de caminho ou limitar
 * requisição, e a marca sumiria do painel sem aviso.
 *
 * O arquivo é monocromático com fundo transparente, então funciona sobre creme
 * e sobre branco sem variante.
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
