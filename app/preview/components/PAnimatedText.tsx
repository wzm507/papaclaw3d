'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface PAnimatedTextProps {
  children: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  splitBy?: 'word' | 'char'
  stagger?: number
  delay?: number
  once?: boolean
}

export default function PAnimatedText({
  children,
  className = '',
  as: Tag = 'h2',
  splitBy = 'word',
  stagger = 0.04,
  delay = 0,
  once = true,
}: PAnimatedTextProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      const targets = el.querySelectorAll('.p-word, .p-char')
      gsap.fromTo(
        targets,
        { opacity: 0, y: '110%', rotateX: -60 },
        {
          opacity: 1,
          y: '0%',
          rotateX: 0,
          duration: 0.9,
          stagger,
          delay,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once,
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [splitBy, stagger, delay, once])

  const parts = splitBy === 'word' ? children.split(' ') : children.split('')

  return (
    <Tag
      ref={ref as React.RefObject<HTMLHeadingElement & HTMLParagraphElement & HTMLSpanElement>}
      className={`overflow-hidden ${className}`}
      style={{ perspective: '800px' }}
    >
      {parts.map((part, index) => (
        <span
          key={index}
          className={`${splitBy === 'word' ? 'p-word' : 'p-char'} inline-block will-change-transform`}
          style={{ transformOrigin: 'center bottom' }}
        >
          {splitBy === 'word' ? part : part === ' ' ? '\u00A0' : part}
          {splitBy === 'word' && index < parts.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </Tag>
  )
}
