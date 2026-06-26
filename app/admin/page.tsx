'use client'

import { useState } from 'react'
import Link from 'next/link'

const modules = [
  { href: '/admin/company', icon: 'CO', title: '企业信息', description: '公司名字、口号、联系方式和导航菜单' },
  { href: '/admin/hero', icon: 'HM', title: '首页配置', description: '首屏大标题、副标题和视觉图' },
  { href: '/admin/team', icon: 'TM', title: '团队管理', description: '团队成员姓名和头像' },
  { href: '/admin/projects', icon: 'PR', title: '项目管理', description: '案例项目的标题、图片和标签' },
  { href: '/admin/seo-topics', icon: 'SEO', title: 'SEO专题页', description: '关键词、专题内容、FAQ 和 AI 检索文本' },
  { href: '/admin/expertises', icon: 'SV', title: '专业服务', description: '服务领域和能力介绍' },
  { href: '/admin/process', icon: 'FL', title: '工作流程', description: '工作步骤和说明' },
  { href: '/admin/why', icon: 'AD', title: '优势理由', description: '选择我们的理由和优势' },
  { href: '/admin/faq', icon: 'QA', title: 'FAQ管理', description: '官网常见问答' },
  { href: '/admin/footer', icon: 'FT', title: '页脚配置', description: '页脚链接、版权和社交信息' },
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
    <div className="p-6 md:p-10">
      <div className="mb-8 border-b border-[#E5E5E0] pb-8">
        <p className="p-kicker mb-3">PAPACLAW Content Studio</p>
        <h1 className="text-[clamp(2rem,4vw,4rem)] font-semibold leading-none text-[#0F1C1A]">
          官网内容控制台
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#737373]">
          管理官网内容，实时预览并发布更新
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center border border-[#0F1C1A] bg-[#0F1C1A] px-5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-[#B08D57] hover:bg-[#B08D57]"
        >
          预览官网
        </a>
        <button
          onClick={handlePublish}
          disabled={publishing}
          className="inline-flex min-h-11 items-center border border-[#0F1C1A] bg-white px-5 text-sm font-semibold text-[#0F1C1A] transition-all hover:-translate-y-0.5 hover:border-[#B08D57] hover:text-[#B08D57] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {publishing ? '发布中...' : '发布官网'}
        </button>
        {publishStatus === 'success' && (
          <span className="inline-flex min-h-11 items-center text-sm font-semibold text-green-600">发布成功</span>
        )}
        {publishStatus === 'error' && (
          <span className="inline-flex min-h-11 items-center text-sm font-semibold text-red-600">发布失败，请重试</span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod) => (
          <Link
            key={mod.href}
            href={mod.href}
            className="group block border border-[#E5E5E0] bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0F1C1A] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
          >
            <div className="mb-8 flex h-9 w-12 items-center justify-center border border-[#0F1C1A] bg-[#0F1C1A] text-xs font-semibold text-white">
              {mod.icon}
            </div>
            <h3 className="text-lg font-semibold text-[#0F1C1A] transition-colors group-hover:text-[#B08D57]">
              {mod.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#737373]">
              {mod.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
