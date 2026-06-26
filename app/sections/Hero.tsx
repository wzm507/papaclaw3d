'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const hasAnimated = useRef(false)

  useLayoutEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-line',
        { y: '110%', opacity: 0, rotateX: -55 },
        { y: '0%', opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.12, ease: 'expo.out', delay: 0.2 }
      )
      gsap.fromTo('.hero-sub', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'expo.out', delay: 0.9 })
      gsap.fromTo('.hero-cta', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', delay: 1.2 })
      gsap.fromTo('.hero-card', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 1.0 })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={heroRef} id="home" className="p-section relative min-h-screen overflow-hidden bg-[#F7F7F5] pt-32 md:pt-40">
      <div className="p-inner relative z-10 pb-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-12">
            <p className="hero-sub p-kicker mb-8">Papa Claw · 爬爬虾</p>

            <div className="overflow-hidden" style={{ perspective: '800px' }}>
              <h1 className="hero-line p-display mb-2 text-[#0F1C1A] will-change-transform" style={{ transformOrigin: 'center bottom' }}>
                我们不靠赚方案的钱活着。
              </h1>
            </div>
            <div className="overflow-hidden" style={{ perspective: '800px' }}>
              <h1 className="hero-line p-display mb-12 text-[#0F1C1A] will-change-transform" style={{ transformOrigin: 'center bottom' }}>
                我们靠你赚到钱活着。
              </h1>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="max-w-2xl">
              <p className="hero-sub p-body-lg">先付出，先交朋友，用成本价帮你出海。</p>
              <p className="hero-sub p-body-lg mt-2">你不赚钱，我们只收工时费。</p>
            </div>

            <div className="hero-cta mt-12 flex flex-wrap gap-4">
              <a href="#contact" className="p-btn">免费咨询 →</a>
              <a href="#about" className="p-btn-ghost">了解我们</a>
            </div>
          </div>

          <div className="flex items-start lg:col-span-4">
            <div className="hero-card w-full border border-[#E5E5E0] bg-white p-6 md:p-8">
              <p className="mb-6 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[#737373]">Operating Model</p>
              <p className="p-heading-lg mb-1">先付出。</p>
              <p className="p-heading-lg mb-6">你先赚钱。</p>
              <div className="flex flex-wrap gap-2">
                <span className="p-chip p-chip-accent">不中标不收费</span>
                <span className="p-chip">成本价起步</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-[#E5E5E0] bg-[#F7F7F5]">
        <div className="p-inner flex items-center justify-between py-4">
          <p className="hidden font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[#737373] md:block">
            14 年中东 · 南沙港澳政企 · 6 人精干团队
          </p>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[#737373]">
            Scroll to explore
          </p>
        </div>
      </div>

      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-1/3 opacity-[0.04]"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, currentColor 0, currentColor 1px, transparent 1px, transparent 48px)',
        }}
      />
    </section>
  )
}
