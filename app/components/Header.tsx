'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Logo from './Logo'

interface HeaderProps {
  menuItems: string[]
  whatsappUrl: string
}

export default function Header({ menuItems, whatsappUrl }: HeaderProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const sectionIds = ['home', 'about', 'audience', 'services', 'advantages', 'news', 'faq', 'contact']
  const menuWithoutProcess = menuItems.filter((item) => !item.includes('落地流程') && !item.includes('路径'))
  const normalizedMenuItems = menuWithoutProcess.some((item) => item.includes('新闻'))
    ? menuWithoutProcess
    : [...menuWithoutProcess.slice(0, 5), '新闻动态', ...menuWithoutProcess.slice(5)]
  const homePrefix = pathname === '/' ? '' : '/'
  const hrefFor = (item: string, index: number) => {
    if (item.includes('新闻')) {
      return '/news'
    }

    return `${homePrefix}#${sectionIds[index] || 'home'}`
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 h-20 w-screen max-w-[100vw] bg-transparent px-4 py-4 md:px-8">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="pointer-events-auto absolute left-4 top-4 min-h-11 shrink-0 rounded-content border border-current bg-transparent px-4 font-utility text-sm font-semibold text-white mix-blend-difference transition-all duration-300 hover:-translate-y-0.5 md:left-8"
        >
          菜单
        </button>

        <div className={`absolute left-1/2 top-4 -translate-x-1/2 transition-all duration-500 ${isScrolled ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <Logo />
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto absolute right-4 top-4 inline-flex min-h-11 shrink-0 items-center rounded-content border border-current bg-transparent px-4 font-utility text-sm font-semibold text-white mix-blend-difference transition-all duration-300 hover:-translate-y-0.5 md:right-8 md:px-5"
        >
          联系
        </a>
      </header>

      {/* Full Screen Menu */}
      <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-midnight-ink transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{ transitionTimingFunction: 'cubic-bezier(.23,1,.32,1)' }}
        />
        <div
          className={`absolute inset-0 bg-midnight-ink transition-transform duration-500 delay-75 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{ transitionTimingFunction: 'cubic-bezier(.23,1,.32,1)' }}
        />

        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-6 min-h-11 rounded-content border border-white/25 bg-transparent px-4 font-utility text-sm font-semibold text-white transition-colors hover:border-white"
          >
            关闭
          </button>

          <nav className="max-w-5xl space-y-3">
            {normalizedMenuItems.map((item, i) => (
              <a
                key={item}
                href={hrefFor(item, i)}
                onClick={() => setIsMenuOpen(false)}
                className={`block font-utility text-4xl font-semibold leading-tight text-white transition-colors hover:text-bubblegum-blush md:text-display transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{
                  transitionDelay: `${150 + i * 50}ms`,
                  transitionDuration: '500ms',
                  transitionTimingFunction: 'cubic-bezier(.23,1,.32,1)',
                }}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}
