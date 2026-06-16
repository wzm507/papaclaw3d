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
    <section ref={sectionRef} className="editorial-section bg-pale-canvas">
      <Section3DBackground theme="blue" />
      <div className="absolute inset-x-6 top-10 border-t border-deep-forest/15" />

      <div className="max-w-7xl mx-auto relative z-10">
        <p className="editorial-kicker text-center mb-4">Why Papa Claw</p>
        <h2 ref={titleRef} className="editorial-heading text-center mb-6 opacity-0">
          {title}
        </h2>
        <p className="editorial-body text-center mb-16 editorial-measure mx-auto">
          {subtitle}
        </p>

        <div ref={cardsRef} className="grid grid-cols-1 border border-deep-forest/20 md:grid-cols-2">
          {reasons.map((reason, i) => (
            <div
              key={i}
              className="why-card bg-paper-white/82 p-7 md:p-9 transition-colors duration-300 opacity-0 relative overflow-hidden border-b border-deep-forest/15 md:border-r md:even:border-r-0 last:border-b-0 group"
            >
              <div className="relative z-10">
                <p className="editorial-meta mb-5">0{i + 1}</p>
                <h3 className="font-editorial text-heading font-bold text-deep-forest mb-4">
                  {reason.title}
                </h3>
                <p className="editorial-body">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 底部装饰 */}
        <div className="mt-16 flex justify-center items-center gap-4">
          <div className="w-16 h-px bg-foudre-pink/35" />
          <div className="h-1.5 w-1.5 bg-foudre-pink/45" />
          <div className="w-16 h-px bg-foudre-pink/35" />
        </div>
      </div>
    </section>
  )
}
