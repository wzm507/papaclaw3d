'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import MagneticButton from '../components/MagneticButton'
import TextMarquee from '../components/TextMarquee'

interface HeroProps {
  title: string
  subtitle1: string
  subtitle2: string
  backgroundImage: string
  cards: { image: string; bubble: string }[]
}

export default function Hero({ title, subtitle1, subtitle2 }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-word',
        { y: '110%', opacity: 0, rotateX: -60 },
        { y: '0%', opacity: 1, rotateX: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out', delay: 0.3 }
      )
      gsap.fromTo('.hero-sub', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'expo.out', delay: 1 })
      gsap.fromTo('.hero-cta', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', delay: 1.4 })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const titleWords = title.split('')

  return (
    <section ref={heroRef} id="home" className="section relative min-h-screen overflow-hidden bg-pale-canvas pt-32 md:pt-40">
      <div className="section-inner relative z-10 pb-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <p className="hero-sub kicker mb-6 opacity-0">Papa Claw · 爬爬虾</p>
            <h1
              ref={titleRef}
              className="display-text mb-8 overflow-hidden text-deep-forest"
              style={{ perspective: '800px' }}
            >
              {titleWords.map((char, i) => (
                <span key={i} className="hero-word inline-block will-change-transform" style={{ transformOrigin: 'center bottom' }}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>
            <p className="hero-sub body-text max-w-xl opacity-0">{subtitle1}</p>
            <p className="hero-sub body-text mt-4 max-w-xl opacity-0">{subtitle2}</p>

            <div className="hero-cta mt-10 flex flex-wrap gap-4 opacity-0">
              <MagneticButton href="#contact">
                <span className="btn-primary">免费咨询 →</span>
              </MagneticButton>
              <MagneticButton href="#about">
                <span className="btn-secondary">了解我们</span>
              </MagneticButton>
            </div>
          </div>

          <div className="flex items-end lg:col-span-4">
            <div className="hero-sub w-full card-surface p-6 opacity-0">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-tint"> operating model </p>
              <p className="font-display text-2xl font-semibold leading-tight text-deep-forest">先付出。</p>
              <p className="font-display text-2xl font-semibold leading-tight text-deep-forest">你先赚钱。</p>
              <div className="mt-6 flex items-center gap-3">
                <span className="chip-accent">不中标不收费</span>
                <span className="chip">成本价起步</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-ash-whisper bg-pale-canvas py-4">
        <TextMarquee
          text="我们不靠赚方案的钱活着 · 我们靠你赚到钱活着 · 先付出 · 先交朋友 · 成本价帮你出海"
          className="font-mono text-xs uppercase tracking-widest text-slate-tint"
          speed={40}
        />
      </div>

      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-1/3 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, currentColor 0, currentColor 1px, transparent 1px, transparent 40px)',
        }}
      />
    </section>
  )
}
