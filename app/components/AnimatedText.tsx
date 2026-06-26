'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface AnimatedTextProps {
  children: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  splitBy?: 'word' | 'line'
  stagger?: number
  delay?: number
  once?: boolean
}

export default function AnimatedText({
  children,
  className = '',
  as: Tag = 'h2',
  splitBy = 'word',
  stagger = 0.04,
  delay = 0,
  once = true,
}: AnimatedTextProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      const targets = splitBy === 'word' ? el.querySelectorAll('.word') : el.querySelectorAll('.line')
      gsap.fromTo(
        targets,
        { opacity: 0, y: '100%', rotateX: -45 },
        {
          opacity: 1,
          y: '0%',
          rotateX: 0,
          duration: 0.8,
          stagger,
          delay,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            once,
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [splitBy, stagger, delay, once])

  const parts = splitBy === 'word' ? children.split(' ') : [children]

  return (
    <Tag
      ref={ref as React.RefObject<HTMLHeadingElement & HTMLParagraphElement & HTMLSpanElement>}
      className={`overflow-hidden ${className}`}
      style={{ perspective: '800px' }}
    >
      {parts.map((part, index) => (
        <span
          key={index}
          className={`${splitBy === 'word' ? 'word' : 'line'} inline-block will-change-transform`}
          style={{ transformOrigin: 'center bottom' }}
        >
          {splitBy === 'word' ? part : ''}
          {splitBy === 'word' && index < parts.length - 1 ? '\u00A0' : ''}
          {splitBy === 'line' && part}
        </span>
      ))}
    </Tag>
  )
}
