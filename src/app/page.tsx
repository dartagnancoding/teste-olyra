import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/features/auth/application/session'

export default async function HomePage() {
  redirect((await isAuthenticated()) ? '/crm' : '/login')
}
