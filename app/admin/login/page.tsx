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

    // Simulate a brief delay for UX
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
    <div className="flex min-h-screen items-center justify-center bg-midnight-ink px-4">
      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="mb-8 text-center">
          <h1 className="font-sans text-4xl font-semibold tracking-tight text-white">
            PAPACLAW
          </h1>
          <p className="mt-2 font-sans text-sm text-white/45">Content Studio</p>
        </div>

        {/* Login Card */}
        <div className="rounded-content border border-white/10 bg-white p-8 shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
          <h2 className="mb-6 text-center font-sans text-xl font-semibold text-deep-forest">
            登录
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block font-sans text-sm font-semibold text-deep-forest"
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
                className="w-full rounded-content border border-ash-whisper bg-pale-canvas px-4 py-3 font-sans text-sm text-deep-forest transition-colors placeholder:text-slate-tint/60 focus:border-foudre-pink focus:outline-none focus:ring-2 focus:ring-foudre-pink/30"
                autoFocus
              />
            </div>

            {error && (
              <p className="rounded-content border border-red-200 bg-red-50 px-3 py-2 font-sans text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="min-h-11 w-full rounded-content border border-deep-forest bg-deep-forest py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:border-foudre-pink hover:bg-foudre-pink disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? '验证中...' : '登录'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
