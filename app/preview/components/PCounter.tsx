'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface PCounterProps {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

export default function PCounter({ value, prefix = '', suffix = '', duration = 1.8, className = '' }: PCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const valueRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    const valueEl = valueRef.current
    if (!el || !valueEl) return

    const ctx = gsap.context(() => {
      const obj = { value: 0 }
      gsap.to(obj, {
        value,
        duration,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true,
        },
        onUpdate: () => {
          valueEl.textContent = String(Math.round(obj.value))
        },
      })
    }, el)

    return () => ctx.revert()
  }, [value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      <span ref={valueRef}>{value}</span>
      {suffix}
    </span>
  )
}
