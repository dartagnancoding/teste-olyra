'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { logoutAction } from '@/features/auth/actions'

export function LogoutButton() {
  const router = useRouter()
  const [isLeaving, setIsLeaving] = useState(false)

  async function handleLogout() {
    setIsLeaving(true)

    try {
      await logoutAction()
      router.replace('/login')
      router.refresh()
    } finally {
      setIsLeaving(false)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} disabled={isLeaving}>
      {isLeaving ? 'Saindo…' : 'Sair'}
    </Button>
  )
}
