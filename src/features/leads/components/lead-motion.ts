'use client'

import { useReducedMotion } from 'motion/react'

/** Curva warm da paleta — a mesma `--ease-out-soft` do CSS. */
const EASE_OUT_SOFT = [0, 0, 0.2, 1] as const

const ENTER_SECONDS = 0.32
const EXIT_SECONDS = 0.2

/**
 * Movimento de entrada e saída de um lead, compartilhado pela lista e pelos
 * cards para que a mesma ação pareça a mesma coisa nas duas visões.
 *
 * Retorna uma função em vez das props prontas porque as props dependem do
 * índice do item: chamar um hook dentro do `map` quebraria a ordem dos hooks.
 * Assim o componente chama `useLeadMotion()` uma vez e aplica por item.
 *
 * O `delay` escalonado vale só para a carga inicial: quando um lead novo entra
 * no topo, ele é o índice 0 e aparece na hora. Escalonar acima de oito itens
 * faria o último esperar quase meio segundo por nada, então o atraso satura.
 *
 * Com `prefers-reduced-motion` tudo colapsa para uma troca de opacidade: a
 * lista ainda comunica que algo entrou ou saiu, sem deslocamento.
 */
export function useLeadMotion() {
  const reduceMotion = useReducedMotion()

  return function leadMotion(index: number) {
    return {
      initial: { opacity: 0, y: reduceMotion ? 0 : 10 },
      animate: { opacity: 1, y: 0 },
      // A transição da saída vai dentro do próprio alvo: precisa ser mais
      // curta que a entrada e sem o atraso escalonado — quem apagou um lead
      // não deve esperar a fila inteira.
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
