'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

export function LogoutButton() {
  const router = useRouter()
  const [isLeaving, setIsLeaving] = useState(false)

  async function handleLogout() {
    setIsLeaving(true)

    try {
      await fetch('/api/auth/logout', { method: 'POST' })
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
