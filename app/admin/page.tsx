'use client'

import { useState } from 'react'
import Link from 'next/link'
import AdminPageHeader from './components/AdminPageHeader'
import AdminButton from './components/AdminButton'
import StatusBadge from './components/StatusBadge'

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
    <div className="p-5 md:p-6">
      <AdminPageHeader
        kicker="PAPACLAW Content Studio"
        title="官网内容控制台"
        description="管理官网内容，实时预览并发布更新"
      >
        <AdminButton variant="secondary" size="sm" asChild>
          <a href="/" target="_blank" rel="noopener noreferrer">
            预览官网
          </a>
        </AdminButton>
        <AdminButton
          variant="primary"
          size="sm"
          onClick={handlePublish}
          loading={publishing}
        >
          发布官网
        </AdminButton>
      </AdminPageHeader>

      {publishStatus === 'success' && (
        <div className="mb-5 border border-green-200 bg-green-50 px-4 py-3">
          <StatusBadge variant="success">发布成功</StatusBadge>
        </div>
      )}
      {publishStatus === 'error' && (
        <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3">
          <StatusBadge variant="error">发布失败，请重试</StatusBadge>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((mod) => (
          <Link
            key={mod.href}
            href={mod.href}
            className="group flex items-start gap-3 border border-[#E5E5E0] bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0F1C1A]"
          >
            <span className="flex h-8 w-10 shrink-0 items-center justify-center border border-[#0F1C1A] bg-[#0F1C1A] text-[10px] font-semibold text-white transition-colors group-hover:bg-[#B08D57] group-hover:border-[#B08D57]">
              {mod.icon}
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-[#0F1C1A] transition-colors group-hover:text-[#B08D57]">
                {mod.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#737373]">
                {mod.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
