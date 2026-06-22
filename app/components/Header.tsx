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
      <header className="fixed top-0 left-0 w-full z-50 px-5 md:px-8 py-4 flex items-center justify-between border-b border-deep-forest/18 bg-pale-canvas/88 backdrop-blur-md">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="min-h-11 border-y border-deep-forest/30 px-3 font-utility text-sm font-semibold text-deep-forest hover:text-foudre-pink transition-colors"
        >
          菜单
        </button>

        <div className={`transition-all duration-500 ${isScrolled ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <Logo />
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-11 inline-flex items-center border border-deep-forest bg-deep-forest px-5 font-utility text-sm font-semibold text-white hover:border-foudre-pink hover:bg-foudre-pink transition-colors"
        >
          联系
        </a>
      </header>

      {/* Full Screen Menu */}
      <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-pale-canvas transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{ transitionTimingFunction: 'cubic-bezier(.23,1,.32,1)' }}
        />
        <div
          className={`absolute inset-0 bg-ash-whisper transition-transform duration-500 delay-75 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{ transitionTimingFunction: 'cubic-bezier(.23,1,.32,1)' }}
        />

        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-6 min-h-11 border-y border-deep-forest/30 px-3 font-utility text-sm font-semibold text-deep-forest hover:text-foudre-pink transition-colors"
          >
            关闭
          </button>

          <nav className="max-w-5xl border-y border-deep-forest/20 py-8 space-y-3">
            {normalizedMenuItems.map((item, i) => (
              <a
                key={item}
                href={hrefFor(item, i)}
                onClick={() => setIsMenuOpen(false)}
                className={`block font-editorial text-4xl md:text-heading-lg font-bold text-deep-forest hover:text-foudre-pink transition-colors transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
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
