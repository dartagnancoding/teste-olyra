import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'

import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-fraunces',
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
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-text">{children}</body>
    </html>
  )
}
