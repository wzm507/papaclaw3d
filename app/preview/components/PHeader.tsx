'use client'

import { useEffect, useState } from 'react'
import { gsap } from 'gsap'

interface PHeaderProps {
  menuItems: string[]
}

const hrefByLabel: Record<string, string> = {
  首页: '#home',
  我们是谁: '#about',
  服务客群: '#audience',
  五大业务: '#services',
  核心壁垒: '#pillars',
  真实案例: '#cases',
  新闻动态: '/news',
  标准问答: '#faq',
  联系: '#contact',
}

export default function PHeader({ menuItems }: PHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      gsap.fromTo(
        '.p-menu-link',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: 'expo.out', delay: 0.15 }
      )
    }
  }, [isMenuOpen])

  const hrefFor = (item: string) => {
    if (item.includes('新闻')) return '/news'
    return hrefByLabel[item] || '#home'
  }

  const navItems = menuItems.filter((item) => !item.includes('落地流程') && !item.includes('路径'))

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 transition-all duration-500 md:px-10 lg:px-16 ${
          isScrolled ? 'bg-[#F7F7F5]/90 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <a href="/" className="relative z-10 text-base font-semibold tracking-tight text-[#0F1C1A]">
          Papa Claw
        </a>

        <div className="flex items-center gap-4">
          <a
            href="mailto:hello@papaclaw.cn"
            className="relative z-10 hidden border border-[#0F1C1A] bg-[#0F1C1A] px-5 py-2 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#B08D57] hover:border-[#B08D57] md:inline-flex"
          >
            免费咨询
          </a>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="relative z-10 flex h-10 w-10 items-center justify-center border border-[#E5E5E0] bg-white text-[#0F1C1A] transition-colors hover:border-[#0F1C1A]"
            aria-label="打开菜单"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 5H14M2 8H14M2 11H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[100] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-[#0F1C1A]/95 backdrop-blur-xl" onClick={() => setIsMenuOpen(false)} />
        <div className="relative z-10 flex h-full flex-col justify-center px-8 md:px-16 lg:px-24">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center border border-white/20 text-white transition-colors hover:border-white md:right-10 lg:right-16"
            aria-label="关闭菜单"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 13L13 1M1 1L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <nav className="space-y-1">
            {navItems.map((item, index) => (
              <a
                key={item}
                href={hrefFor(item)}
                onClick={() => setIsMenuOpen(false)}
                className="p-menu-link block text-4xl font-semibold text-white transition-colors hover:text-[#B08D57] md:text-6xl lg:text-7xl"
                style={{ opacity: 0 }}
              >
                <span className="mr-4 font-mono text-sm text-white/30">{String(index + 1).padStart(2, '0')}</span>
                {item}
              </a>
            ))}
          </nav>

          <div className="p-menu-link absolute bottom-10 left-8 right-8 flex flex-col justify-between gap-6 border-t border-white/10 pt-8 text-white/50 md:left-16 md:right-16 lg:left-24 lg:right-24 lg:flex-row lg:items-center">
            <a href="mailto:hello@papaclaw.cn" className="text-sm transition-colors hover:text-white">
              hello@papaclaw.cn
            </a>
            <p className="text-sm">南沙跨境贸易产业集聚区</p>
          </div>
        </div>
      </div>
    </>
  )
}
