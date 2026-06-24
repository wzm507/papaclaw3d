'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  { href: '/admin', icon: 'DS', label: '仪表盘' },
  { href: '/admin/company', icon: 'CO', label: '企业信息' },
  { href: '/admin/hero', icon: 'HM', label: '首页配置' },
  { href: '/admin/team', icon: 'TM', label: '团队管理' },
  { href: '/admin/projects', icon: 'PR', label: '项目管理' },
  { href: '/admin/seo-topics', icon: 'SEO', label: 'SEO专题页' },
  { href: '/admin/expertises', icon: 'SV', label: '专业服务' },
  { href: '/admin/process', icon: 'FL', label: '工作流程' },
  { href: '/admin/why', icon: 'AD', label: '优势理由' },
  { href: '/admin/faq', icon: 'QA', label: 'FAQ管理' },
  { href: '/admin/footer', icon: 'FT', label: '页脚配置' },
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
    <aside className="flex min-h-screen w-[280px] shrink-0 flex-col bg-midnight-ink">
      {/* Logo */}
      <div className="border-b border-white/10 px-6 py-7">
        <Link href="/admin" className="block">
          <h1 className="font-utility text-2xl font-semibold tracking-tight text-white">
            PAPACLAW
          </h1>
          <p className="mt-1 font-utility text-xs text-white/45">Content Studio</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1.5">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex min-h-11 items-center gap-3 rounded-content px-3 py-2.5 font-utility text-sm transition-colors duration-150 ${
                  isActive(item.href)
                    ? 'bg-white text-midnight-ink font-semibold'
                    : 'text-white/62 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className={`flex h-7 w-9 items-center justify-center rounded-content border text-[10px] font-semibold ${
                  isActive(item.href) ? 'border-midnight-ink/10 bg-midnight-ink text-white' : 'border-white/12 bg-white/5 text-white/62'
                }`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 px-3 py-4">
        <button
          onClick={handleLogout}
          className="flex min-h-11 w-full items-center gap-3 rounded-content px-3 py-2.5 font-utility text-sm text-white/60 transition-colors duration-150 hover:bg-white/10 hover:text-white"
        >
          <span className="flex h-7 w-9 items-center justify-center rounded-content border border-white/12 bg-white/5 text-[10px] font-semibold">OUT</span>
          <span>退出登录</span>
        </button>
      </div>
    </aside>
  )
}
