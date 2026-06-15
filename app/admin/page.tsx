'use client'

import { useState } from 'react'
import Link from 'next/link'

const modules = [
  {
    href: '/admin/company',
    icon: '🏢',
    title: '企业信息',
    description: '管理公司基本信息、简介和联系方式',
  },
  {
    href: '/admin/hero',
    icon: '🎯',
    title: '首页配置',
    description: '配置首页横幅、标语和视觉展示',
  },
  {
    href: '/admin/team',
    icon: '👥',
    title: '团队管理',
    description: '管理团队成员信息和展示顺序',
  },
  {
    href: '/admin/projects',
    icon: '💼',
    title: '项目管理',
    description: '管理项目案例、图片和详情',
  },
  {
    href: '/admin/expertises',
    icon: '⚡',
    title: '专业服务',
    description: '管理专业服务领域和能力展示',
  },
  {
    href: '/admin/process',
    icon: '📋',
    title: '工作流程',
    description: '配置工作流程步骤和说明',
  },
  {
    href: '/admin/why',
    icon: '💎',
    title: '优势理由',
    description: '管理选择我们的理由和优势',
  },
  {
    href: '/admin/faq',
    icon: '❓',
    title: 'FAQ管理',
    description: '管理常见问题与解答内容',
  },
  {
    href: '/admin/footer',
    icon: '📎',
    title: '页脚配置',
    description: '配置页脚链接、版权和社交信息',
  },
]

export default function AdminDashboard() {
  const [publishing, setPublishing] = useState(false)
  const [publishStatus, setPublishStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handlePublish = async () => {
    setPublishing(true)
    setPublishStatus('idle')
    try {
      const res = await fetch('/api/publish', { method: 'POST' })
      const data = await res.json()
      if (res.ok && data.success) {
        setPublishStatus('success')
      } else {
        setPublishStatus('error')
      }
    } catch {
      setPublishStatus('error')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-deep-forest font-clash">
          PAPACLAW CMS 管理后台
        </h1>
        <p className="text-deep-forest/60 mt-2">
          管理官网内容，实时预览并发布更新
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-8">
        <a
          href="/preview"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-badge bg-deep-forest text-white text-sm font-medium hover:bg-deep-forest/90 transition-colors"
        >
          👁 预览官网
        </a>
        <button
          onClick={handlePublish}
          disabled={publishing}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-badge bg-foudre-pink text-white text-sm font-medium hover:bg-foudre-pink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {publishing ? '发布中...' : '🚀 发布官网'}
        </button>
        {publishStatus === 'success' && (
          <span className="inline-flex items-center text-sm text-green-600 font-medium">✓ 发布成功</span>
        )}
        {publishStatus === 'error' && (
          <span className="inline-flex items-center text-sm text-red-600 font-medium">✗ 发布失败，请重试</span>
        )}
      </div>

      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {modules.map((mod) => (
          <Link
            key={mod.href}
            href={mod.href}
            className="group block bg-white rounded-card p-6 border border-ash-whisper hover:border-foudre-pink/40 hover:shadow-lg hover:shadow-foudre-pink/5 transition-all duration-200"
          >
            <div className="text-3xl mb-3">{mod.icon}</div>
            <h3 className="text-lg font-semibold text-deep-forest group-hover:text-foudre-pink transition-colors">
              {mod.title}
            </h3>
            <p className="text-sm text-deep-forest/50 mt-1.5 leading-relaxed">
              {mod.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
