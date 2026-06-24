'use client'

import { useEffect } from 'react'
import { animateLogoLetters } from '../lib/animations'

export default function Logo() {
  useEffect(() => {
    animateLogoLetters()
  }, [])

  const letters = ['P', 'A', 'P', 'A', 'C', 'L', 'A', 'W']

  return (
    <div className="flex items-center gap-0.5 rounded-content px-2 py-1.5">
      {letters.map((letter, i) => (
        <span
          key={i}
          className="logo-letter inline-block font-utility text-xl font-semibold text-white opacity-0 mix-blend-difference"
          style={{ transform: 'translateY(100px)' }}
        >
          {letter}
        </span>
      ))}
    </div>
  )
}
