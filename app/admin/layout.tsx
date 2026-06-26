'use client'

import { useState } from 'react'
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
  const [mobileOpen, setMobileOpen] = useState(false)

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#F7F7F5]">
        <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center border-b border-[#E5E5E0] bg-white px-4 md:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center border border-[#E5E5E0] text-[#0F1C1A]"
              aria-label="打开菜单"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
            <span className="ml-3 text-sm font-semibold text-[#0F1C1A]">PAPACLAW CMS</span>
          </header>
          <main className="flex-1 overflow-y-auto bg-[#F7F7F5]">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
