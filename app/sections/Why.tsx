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
  const stickyRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => {
      mm.add('(min-width: 768px)', () => {
        const cards = cardsRef.current?.querySelectorAll('.why-card') || []
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=170%',
            pin: stickyRef.current,
            scrub: 0.5,
            pinSpacing: true,
          },
        })

        tl.fromTo(
          titleRef.current,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out' },
          0
        )

        tl.fromTo(
          cards,
          { y: 80, opacity: 0, rotateX: 7 },
          { y: 0, opacity: 1, rotateX: 0, stagger: 0.08, ease: 'power2.out' },
          0.12
        )

        tl.to(
          [titleRef.current, cardsRef.current],
          { y: -45, opacity: 0, ease: 'power2.in' },
          0.78
        )
      })

      mm.add('(max-width: 767px)', () => {
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
            { y: 55, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.75,
              stagger: 0.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 80%',
              },
            }
          )
        }
      })

    }, sectionRef)

    return () => {
      mm.revert()
      ctx.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative w-full bg-pale-canvas md:h-[270vh]">
      <div ref={stickyRef} className="relative min-h-screen overflow-hidden px-6 py-24 md:flex md:h-screen md:items-center md:py-0">
        <Section3DBackground theme="blue" />
        <div className="absolute inset-x-6 top-10 border-t border-deep-forest/15" />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <p className="editorial-kicker text-center mb-4">Why Papa Claw</p>
          <h2 ref={titleRef} className="text-safe mx-auto mb-6 max-w-[14ch] text-center font-editorial text-[clamp(2.1rem,4.3vw,4.1rem)] font-bold leading-[1.03] text-deep-forest opacity-0 md:max-w-[18ch]">
            {title}
          </h2>
          <p className="editorial-body text-pretty text-center mb-10 editorial-measure mx-auto md:mb-12">
            {subtitle}
          </p>

          <div ref={cardsRef} className="grid grid-cols-1 border border-deep-forest/20 md:grid-cols-2">
            {reasons.map((reason, i) => (
              <div
                key={i}
                className="why-card relative overflow-hidden border-b border-deep-forest/15 bg-paper-white/82 p-6 opacity-0 transition-colors duration-300 last:border-b-0 md:border-r md:p-7 md:even:border-r-0"
              >
                <div className="relative z-10">
                  <p className="editorial-meta mb-4">0{i + 1}</p>
                  <h3 className="text-safe mb-3 font-editorial text-[clamp(1.45rem,2.3vw,2.2rem)] font-bold leading-tight text-deep-forest">
                    {reason.title}
                  </h3>
                  <p className="editorial-body text-pretty">
                    {reason.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-foudre-pink/35" />
            <div className="h-1.5 w-1.5 bg-foudre-pink/45" />
            <div className="w-16 h-px bg-foudre-pink/35" />
          </div>
        </div>
      </div>
    </section>
  )
}
