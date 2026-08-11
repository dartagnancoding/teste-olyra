'use client'

import { useState } from 'react'

import { Modal } from '@/components/ui/modal'

type WelcomeEmailPreviewProps = {
  subject: string
  html: string
  previewName: string
  isRedirected: boolean
}

/**
 * `<iframe sandbox>` e não injeção na página: solto no documento, o HTML de
 * email herdaria os resets do painel e a prévia mostraria algo que não existe.
 * O `sandbox` vazio ainda bloqueia script, formulário e navegação.
 */
export function WelcomeEmailPreview({
  subject,
  html,
  previewName,
  isRedirected,
}: WelcomeEmailPreviewProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-text-muted transition-colors duration-150 ease-out hover:bg-sage-soft hover:text-forest"
      >
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="size-4 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="1.75" y="3.25" width="12.5" height="9.5" rx="1.5" />
          <path d="M2.5 4.5L8 8.75l5.5-4.25" />
        </svg>
        {/* No celular o rótulo sai e sobra o ícone: o header tem a logo e o
            botão de sair disputando a mesma linha a 360px. */}
        <span className="hidden sm:inline">Email de boas-vindas</span>
        <span className="sr-only sm:hidden">Ver o email de boas-vindas</span>
      </button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Email de boas-vindas"
        size="wide"
      >
        <p className="text-sm text-text-muted">
          É este o email disparado ao clicar em “Enviar boas-vindas”. O nome do lead
          entra no lugar de{' '}
          <strong className="font-medium text-text">{previewName}</strong>.
        </p>

        {/* Dito na tela, e não só no README: quem testar o painel pela primeira
            vez precisa saber por que o email não chegou na caixa dele. */}
        {isRedirected && (
          <p className="mt-3 rounded-md border border-sage bg-sage-soft px-4 py-3 text-sm text-text">
            A conta de email está em modo de teste e só entrega no endereço do
            administrador. Os envios são desviados para lá com uma tarja indicando
            o destinatário original — o disparo acontece de verdade, mas o lead não
            recebe até um domínio próprio ser verificado.
          </p>
        )}

        <dl className="mt-4 rounded-md border border-border bg-bg px-4 py-3 text-sm">
          <div className="flex gap-3">
            <dt className="shrink-0 text-text-muted">Assunto</dt>
            <dd className="min-w-0 font-medium">{subject}</dd>
          </div>
        </dl>

        <iframe
          title="Pré-visualização do email de boas-vindas"
          srcDoc={html}
          sandbox=""
          className="mt-4 h-[55vh] w-full rounded-md border border-border bg-white"
        />
      </Modal>
    </>
  )
}
