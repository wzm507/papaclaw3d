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
    <div className="min-h-screen bg-deep-forest flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white tracking-tight font-clash">
            PAPACLAW
          </h1>
          <p className="text-white/40 text-sm mt-2">CMS 管理后台</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-card p-8">
          <h2 className="text-xl font-semibold text-deep-forest mb-6 text-center">
            登录
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-deep-forest/70 mb-1.5"
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
                className="w-full px-4 py-2.5 rounded-badge border border-ash-whisper bg-pale-canvas text-deep-forest text-sm placeholder:text-deep-forest/30 focus:outline-none focus:border-foudre-pink focus:ring-1 focus:ring-foudre-pink/30 transition-colors"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-sm text-foudre-pink bg-foudre-pink/10 px-3 py-2 rounded-badge">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-2.5 rounded-badge bg-foudre-pink text-white text-sm font-medium hover:bg-foudre-pink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '验证中...' : '登录'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
