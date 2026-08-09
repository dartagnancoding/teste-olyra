import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/lib/auth'

export default async function HomePage() {
  redirect((await isAuthenticated()) ? '/crm' : '/login')
}
