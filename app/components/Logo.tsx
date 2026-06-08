'use client'

import { useEffect } from 'react'
import { animateLogoLetters } from '../lib/animations'

export default function Logo() {
  useEffect(() => {
    animateLogoLetters()
  }, [])

  const letters = ['P', 'A', 'P', 'A', 'C', 'L', 'A', 'W']

  return (
    <div className="flex items-center gap-0.5">
      {letters.map((letter, i) => (
        <span
          key={i}
          className="logo-letter inline-block text-2xl font-black text-deep-forest opacity-0"
          style={{ transform: 'translateY(100px)' }}
        >
          {letter}
        </span>
      ))}
    </div>
  )
}
