'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Section3DBackground from '../components/Section3DBackground'

gsap.registerPlugin(ScrollTrigger)

interface WhyProps {
  title: string
  subtitle: string
  reasons: { title: string; description: string }[]
}

export default function Why({ title, subtitle, reasons }: WhyProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      )

      const cards = cardsRef.current?.querySelectorAll('.why-card')
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="section py-24 px-6 bg-pale-canvas relative overflow-hidden">
      <Section3DBackground theme="blue" />
      {/* 装饰背景元素 */}
      <div className="absolute top-10 left-1/4 w-40 h-40 rounded-full bg-foudre-pink/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-56 h-56 rounded-full bg-bubblegum-blush/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <h2 ref={titleRef} className="text-heading-lg font-bold text-deep-forest text-center mb-6 opacity-0">
          {title}
        </h2>
        <p className="text-body text-deep-forest/60 text-center mb-16 max-w-2xl mx-auto">
          {subtitle}
        </p>

        {/* Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reasons.map((reason, i) => (
            <div
              key={i}
              className="why-card bg-white rounded-content p-8 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 opacity-0 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-foudre-pink/5 rounded-bl-full transition-transform group-hover:scale-125" />
              <div className="relative z-10">
                <h3 className="text-heading font-bold text-deep-forest mb-4">
                  {reason.title}
                </h3>
                <p className="text-body text-deep-forest/70">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 底部装饰 */}
        <div className="mt-16 flex justify-center items-center gap-4">
          <div className="w-16 h-px bg-foudre-pink/20" />
          <div className="w-2 h-2 rounded-full bg-foudre-pink/30" />
          <div className="w-16 h-px bg-foudre-pink/20" />
        </div>
      </div>
    </section>
  )
}
