'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  { href: '/admin', icon: '🏠', label: '仪表盘' },
  { href: '/admin/company', icon: '🏢', label: '企业信息' },
  { href: '/admin/hero', icon: '🎯', label: '首页配置' },
  { href: '/admin/team', icon: '👥', label: '团队管理' },
  { href: '/admin/projects', icon: '💼', label: '项目管理' },
  { href: '/admin/expertises', icon: '⚡', label: '专业服务' },
  { href: '/admin/process', icon: '📋', label: '工作流程' },
  { href: '/admin/why', icon: '💎', label: '优势理由' },
  { href: '/admin/faq', icon: '❓', label: 'FAQ管理' },
  { href: '/admin/footer', icon: '📎', label: '页脚配置' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('papaclaw_auth_token')
    router.replace('/admin/login')
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-[260px] min-h-screen bg-deep-forest flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/admin" className="block">
          <h1 className="text-2xl font-bold text-white tracking-tight font-clash">
            PAPACLAW
          </h1>
          <p className="text-white/40 text-xs mt-1">CMS 管理后台</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-badge text-sm transition-colors duration-150 ${
                  isActive(item.href)
                    ? 'bg-foudre-pink text-white font-medium'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-badge text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-150 w-full"
        >
          <span className="text-base">🚪</span>
          <span>退出登录</span>
        </button>
      </div>
    </aside>
  )
}
