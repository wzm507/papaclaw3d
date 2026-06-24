'use client'

import { usePathname } from 'next/navigation'
import Sidebar from './components/Sidebar'
import AuthGuard from './components/AuthGuard'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-pale-canvas">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-pale-canvas">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
