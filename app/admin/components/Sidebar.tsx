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
  { href: '/admin/news', icon: 'NW', label: '新闻管理' },
  { href: '/admin/news-sources', icon: 'SRC', label: '新闻源管理' },
  { href: '/admin/expertises', icon: 'SV', label: '专业服务' },
  { href: '/admin/process', icon: 'FL', label: '工作流程' },
  { href: '/admin/why', icon: 'AD', label: '优势理由' },
  { href: '/admin/faq', icon: 'QA', label: 'FAQ管理' },
  { href: '/admin/footer', icon: 'FT', label: '页脚配置' },
]

interface SidebarProps {
  mobileOpen?: boolean
  onCloseMobile?: () => void
}

export default function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
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
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[260px] transform bg-[#0F1C1A] transition-transform duration-200 md:relative md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-white/10 px-5 py-5">
          <Link href="/admin" className="block" onClick={onCloseMobile}>
            <h1 className="text-xl font-semibold tracking-tight text-white">PAPACLAW</h1>
            <p className="mt-0.5 text-[10px] uppercase tracking-widest text-white/40">Content Studio</p>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={item.label}
                    onClick={onCloseMobile}
                    aria-current={active ? 'page' : undefined}
                    className={`flex min-h-10 items-center gap-3 border-l-2 px-3 py-2 text-sm transition-colors duration-150 ${
                      active
                        ? 'border-[#B08D57] bg-white/5 font-semibold text-white'
                        : 'border-transparent text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-8 items-center justify-center border text-[10px] font-semibold ${
                        active
                          ? 'border-white/10 bg-[#B08D57] text-white'
                          : 'border-white/10 bg-white/5 text-white/60'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 px-3 py-3">
          <button
            onClick={handleLogout}
            title="退出登录"
            className="flex min-h-10 w-full items-center gap-3 border-l-2 border-transparent px-3 py-2 text-sm text-white/50 transition-colors duration-150 hover:bg-white/5 hover:text-white"
          >
            <span className="flex h-6 w-8 items-center justify-center border border-white/10 bg-white/5 text-[10px] font-semibold">
              OUT
            </span>
            <span>退出登录</span>
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-[#0F1C1A]/50 md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
    </>
  )
}
