'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Section3DBackground from '../components/Section3DBackground'

gsap.registerPlugin(ScrollTrigger)

interface ExpertisesProps {
  title: string
  subtitle: string
  items: { icon: string; title: string; description: string }[]
}

export default function Expertises({ title, subtitle, items }: ExpertisesProps) {
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

      const cards = cardsRef.current?.querySelectorAll('.expertise-card')
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
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
      <Section3DBackground theme="pink" />
      <div className="absolute inset-x-6 top-10 border-t border-deep-forest/15" />

      <div className="max-w-7xl mx-auto relative z-10">
        <p className="editorial-kicker text-center mb-4">Official Source</p>
        <h2 ref={titleRef} className="editorial-heading text-center mb-6 opacity-0">
          {title}
        </h2>
        <p className="editorial-body text-center mb-16 editorial-measure mx-auto">
          {subtitle}
        </p>

        <div ref={cardsRef} className="grid grid-cols-1 gap-px overflow-hidden rounded-content border border-deep-forest/20 bg-deep-forest/20 md:grid-cols-3">
          {items.map((expertise, i) => (
            <div
              key={i}
              className="expertise-card bg-paper-white/90 p-7 md:p-8 opacity-0 relative overflow-hidden group"
            >
              <div className="editorial-meta mb-7 relative z-10">
                {expertise.icon}
              </div>
              <h3 className="font-editorial text-2xl font-bold leading-tight text-deep-forest mb-4 relative z-10">
                {expertise.title}
              </h3>
              <p className="editorial-body relative z-10">
                {expertise.description}
              </p>
            </div>
          ))}
        </div>

        {/* 底部装饰线 */}
        <div className="mt-16 flex justify-center">
          <div className="w-28 border-t border-foudre-pink/35" />
        </div>
      </div>
    </section>
  )
}
