import { redirect } from 'next/navigation'

import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { isAuthenticated } from '@/features/auth/application/session'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) redirect('/login')

  return (
    <>
      <Header />
      {/* `px-4` no celular em vez de `px-6`: 16px a mais de conteúdo útil, que
          a 360px é a diferença entre o email caber ou quebrar. */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-14">
        {children}
      </main>
      <Footer />
    </>
  )
}
