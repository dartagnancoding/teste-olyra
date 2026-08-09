import { redirect } from 'next/navigation'

import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { isAuthenticated } from '@/features/auth/application/session'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) redirect('/login')

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:py-14">
        {children}
      </main>
      <Footer />
    </>
  )
}
