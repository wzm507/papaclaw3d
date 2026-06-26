'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CursorSpotlight() {
  const spotlight = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = spotlight.current
    if (!el) return

    const move = (e: MouseEvent) => {
      gsap.to(el, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: 'power2.out',
      })
    }

    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <div
      ref={spotlight}
      className="pointer-events-none fixed z-[5] hidden h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 mix-blend-multiply lg:block"
      style={{
        background: 'radial-gradient(circle, rgba(176,141,87,0.12) 0%, rgba(176,141,87,0) 70%)',
      }}
    />
  )
}
