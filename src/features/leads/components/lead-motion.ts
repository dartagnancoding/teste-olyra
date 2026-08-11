'use client'

import { useReducedMotion } from 'motion/react'

/** A mesma `--ease-out-soft` do CSS. */
const EASE_OUT_SOFT = [0, 0, 0.2, 1] as const

const ENTER_SECONDS = 0.32
const EXIT_SECONDS = 0.2

/**
 * Devolve uma função, não as props prontas: elas dependem do índice, e chamar
 * um hook dentro do `map` quebraria a ordem dos hooks.
 *
 * O atraso satura em oito — acima disso o último item esperaria meio segundo
 * por nada. Um lead novo entra no índice 0 e aparece na hora.
 */
export function useLeadMotion() {
  const reduceMotion = useReducedMotion()

  return function leadMotion(index: number) {
    return {
      initial: { opacity: 0, y: reduceMotion ? 0 : 10 },
      animate: { opacity: 1, y: 0 },
      // Transição própria, dentro do alvo: quem apagou um lead não pode
      // esperar o atraso escalonado da entrada.
      exit: {
        opacity: 0,
        y: reduceMotion ? 0 : -6,
        transition: {
          duration: reduceMotion ? 0.01 : EXIT_SECONDS,
          ease: EASE_OUT_SOFT,
        },
      },
      transition: {
        duration: reduceMotion ? 0.01 : ENTER_SECONDS,
        ease: EASE_OUT_SOFT,
        delay: Math.min(index, 8) * 0.04,
      },
    }
  }
}
