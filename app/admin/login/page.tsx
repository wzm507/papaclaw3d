'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminPanel from '../components/AdminPanel'
import AdminButton from '../components/AdminButton'
import AdminMessage from '../components/AdminMessage'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    await new Promise((r) => setTimeout(r, 300))

    if (password === 'papaclaw2026') {
      localStorage.setItem('papaclaw_auth_token', 'authenticated')
      router.replace('/admin')
    } else {
      setError('密码错误，请重试')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F1C1A] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            PAPACLAW
          </h1>
          <p className="mt-2 text-sm text-white/45">Content Studio</p>
        </div>

        <AdminPanel shadow padding="md">
          <h2 className="mb-6 text-center text-lg font-semibold text-[#0F1C1A]">
            登录 CMS
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold text-[#0F1C1A]"
              >
                管理密码
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                placeholder="请输入管理密码"
                className="w-full rounded-sm border border-[#E5E5E0] bg-[#F7F7F5] px-3 py-2.5 text-sm text-[#0F1C1A] transition-colors placeholder:text-[#737373]/60 focus:border-[#B08D57] focus:outline-none focus:ring-2 focus:ring-[#B08D57]/30"
                autoFocus
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'login-error' : undefined}
              />
            </div>

            {error && (
              <AdminMessage variant="error" className="mb-0">
                {error}
              </AdminMessage>
            )}

            <AdminButton
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
              disabled={!password}
            >
              登录
            </AdminButton>
          </form>
        </AdminPanel>
      </div>
    </div>
  )
}
