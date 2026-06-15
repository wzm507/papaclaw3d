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
    <section ref={sectionRef} className="section py-24 px-6 bg-pale-canvas relative overflow-hidden">
      <Section3DBackground theme="pink" />
      {/* 装饰背景元素 */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-foudre-pink/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-bubblegum-blush/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <h2 ref={titleRef} className="text-heading-lg font-bold text-deep-forest text-center mb-6 opacity-0">
          {title}
        </h2>
        <p className="text-body text-deep-forest/60 text-center mb-16 max-w-2xl mx-auto">
          {subtitle}
        </p>

        {/* Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((expertise, i) => (
            <div
              key={i}
              className="expertise-card bg-ash-whisper rounded-content p-8 hover:shadow-xl transition-shadow duration-300 opacity-0 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-foudre-pink/5 rounded-bl-full transition-transform group-hover:scale-110" />
              <div className="text-5xl mb-6 animate-bounce relative z-10" style={{ animationDuration: '2s' }}>
                {expertise.icon}
              </div>
              <h3 className="text-heading font-bold text-deep-forest mb-4 relative z-10">
                {expertise.title}
              </h3>
              <p className="text-body text-deep-forest/70 relative z-10">
                {expertise.description}
              </p>
            </div>
          ))}
        </div>

        {/* 底部装饰线 */}
        <div className="mt-16 flex justify-center">
          <div className="w-24 h-1 bg-foudre-pink/20 rounded-full" />
        </div>
      </div>
    </section>
  )
}
