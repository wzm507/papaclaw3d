'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('papaclaw_auth_token')
    if (token) {
      setIsAuthenticated(true)
    } else {
      router.replace('/admin/login')
    }
    setChecking(false)
  }, [router])

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F7F7F5]">
        <div className="text-sm text-[#0F1C1A]/60">验证中...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
