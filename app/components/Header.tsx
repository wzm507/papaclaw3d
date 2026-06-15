'use client'

import { useState, useEffect } from 'react'
import Logo from './Logo'

interface HeaderProps {
  menuItems: string[]
  whatsappUrl: string
}

export default function Header({ menuItems, whatsappUrl }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="text-deep-forest font-medium text-sm tracking-wide hover:opacity-70 transition-opacity"
        >
          Menu
        </button>

        <div className={`transition-all duration-500 ${isScrolled ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <Logo />
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-deep-forest text-white px-4 py-2 rounded-badge text-sm font-medium hover:bg-foudre-pink transition-colors"
        >
          WhatsApp
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

        <div className="relative z-10 h-full flex flex-col justify-center px-12">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-6 right-6 text-deep-forest text-sm font-medium hover:opacity-70 transition-opacity"
          >
            Fermer
          </button>

          <nav className="space-y-4">
            {menuItems.map((item, i) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/[^a-z]/g, '')}`}
                onClick={() => setIsMenuOpen(false)}
                className={`block text-heading-lg font-bold text-deep-forest hover:text-foudre-pink transition-colors transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
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
