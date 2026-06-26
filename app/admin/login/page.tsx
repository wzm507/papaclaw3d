'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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

        <div className="border border-white/10 bg-white p-8 shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
          <h2 className="mb-6 text-center text-xl font-semibold text-[#0F1C1A]">
            登录
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
                className="w-full border border-[#E5E5E0] bg-[#F7F7F5] px-4 py-3 text-sm text-[#0F1C1A] transition-colors placeholder:text-[#737373]/60 focus:border-[#B08D57] focus:outline-none focus:ring-2 focus:ring-[#B08D57]/30"
                autoFocus
              />
            </div>

            {error && (
              <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="min-h-11 w-full border border-[#0F1C1A] bg-[#0F1C1A] py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-[#B08D57] hover:bg-[#B08D57] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? '验证中...' : '登录'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
