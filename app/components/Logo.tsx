'use client'

import { useEffect } from 'react'
import { animateLogoLetters } from '../lib/animations'

export default function Logo() {
  useEffect(() => {
    animateLogoLetters()
  }, [])

  const letters = ['P', 'A', 'P', 'A', 'C', 'L', 'A', 'W']

  return (
    <div className="flex items-center gap-0.5 border-y border-deep-forest/40 px-3 py-1.5">
      {letters.map((letter, i) => (
        <span
          key={i}
          className="logo-letter inline-block font-editorial text-2xl font-bold text-deep-forest opacity-0"
          style={{ transform: 'translateY(100px)' }}
        >
          {letter}
        </span>
      ))}
    </div>
  )
}
