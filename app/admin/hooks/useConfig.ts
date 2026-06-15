'use client'

import { useState, useEffect, useCallback } from 'react'

type SiteConfig = Record<string, unknown>

interface UseConfigReturn {
  config: SiteConfig | null
  loading: boolean
  saving: boolean
  saveConfig: (newConfig: SiteConfig) => Promise<void>
  refetch: () => void
}

export function useConfig(): UseConfigReturn {
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchConfig = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/config')
      if (!res.ok) throw new Error('获取配置失败')
      const data = await res.json()
      setConfig(data)
    } catch (err) {
      console.error('获取配置失败:', err)
      showToast('获取配置失败，请刷新重试', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  const saveConfig = useCallback(async (newConfig: SiteConfig) => {
    setSaving(true)
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      })
      if (!res.ok) throw new Error('保存配置失败')
      setConfig(newConfig)
      showToast('保存成功', 'success')
    } catch (err) {
      console.error('保存配置失败:', err)
      showToast('保存失败，请重试', 'error')
    } finally {
      setSaving(false)
    }
  }, [])

  return { config, loading, saving, saveConfig, refetch: fetchConfig }
}

type ToastType = 'success' | 'error'

function showToast(message: string, type: ToastType) {
  if (typeof window === 'undefined') return

  const toast = document.createElement('div')
  toast.textContent = message
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 500;
    color: white; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: opacity 0.3s, transform 0.3s;
    opacity: 0; transform: translateY(8px);
    background: ${type === 'success' ? '#16a34a' : '#dc2626'};
  `
  document.body.appendChild(toast)

  requestAnimationFrame(() => {
    toast.style.opacity = '1'
    toast.style.transform = 'translateY(0)'
  })

  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transform = 'translateY(8px)'
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}
