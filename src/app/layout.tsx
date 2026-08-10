import type { Metadata, Viewport } from 'next'
import { Inter, Raleway } from 'next/font/google'

import './globals.css'

/**
 * Raleway é a fonte do site da Olyra (clubolyra.com.br), usada aqui nos
 * títulos. O corpo fica em Inter: em tabela densa e texto de interface ela é
 * mais legível em tamanho pequeno do que uma fonte de display.
 */
const raleway = Raleway({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-raleway',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Olyra — Painel de Leads',
  description:
    'Mini CRM de leads da Olyra: cadastro, busca e envio de boas-vindas para novos contatos.',
}

export const viewport: Viewport = {
  themeColor: '#f5f5f5',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${raleway.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-text">{children}</body>
    </html>
  )
}
