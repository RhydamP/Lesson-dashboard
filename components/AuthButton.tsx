'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AuthButton() {
  const supabase = createClient()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setIsLoggedIn(!!session)
    }

    checkSession()
  }, [supabase])

  const handleLogin = () => {
    router.push('/login')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (isLoggedIn === null) return null // optional: show loader

  return (
    <button onClick={isLoggedIn ? handleLogout : handleLogin}>
      {isLoggedIn ? 'Logout' : 'Login'}
    </button>
  )
}
