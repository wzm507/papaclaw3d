'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Card3D from '../components/Card3D'

interface HeroProps {
  title: string
  subtitle1: string
  subtitle2: string
  backgroundImage: string
  cards: { image: string; bubble: string }[]
}

export default function Hero({ title, subtitle1, subtitle2, backgroundImage, cards }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const bgImageRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const indicatorsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%',
          pin: stickyRef.current,
          scrub: 0.5,
          pinSpacing: true,
        },
      })

      // Phase 1: 背景图缩放 + 标题显示 (0% - 25%)
      tl.fromTo(
        bgImageRef.current,
        { scale: 1, opacity: 1 },
        { scale: 1.15, opacity: 1, ease: 'none' },
        0
      )

      tl.set(
        titleRef.current?.querySelectorAll('.hero-title-line') || [],
        { y: 0, opacity: 1 },
        0
      )

      // Phase 2: 标题淡出 + 卡片飞入 (25% - 50%)
      tl.to(
        titleRef.current,
        { y: -60, opacity: 0, ease: 'power2.in' },
        0.25
      )

      tl.fromTo(
        cardsRef.current,
        { scale: 0.8, opacity: 0, y: 80 },
        { scale: 1, opacity: 1, y: 0, ease: 'power2.out' },
        0.3
      )

      tl.fromTo(
        indicatorsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, ease: 'power2.out' },
        0.4
      )

      // Phase 3: 内容视差 + 淡出 (50% - 100%)
      tl.to(
        [cardsRef.current, indicatorsRef.current],
        { y: -80, opacity: 0, ease: 'power2.in' },
        0.5
      )

      tl.to(
        bgImageRef.current,
        { scale: 1.3, opacity: 0, ease: 'power2.in' },
        0.6
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative w-full" style={{ height: '400vh' }}>
      <div
        ref={stickyRef}
        className="relative h-dvh w-full overflow-hidden"
        style={{ willChange: 'transform' }}
      >
        {/* Background Image with Parallax */}
        <div
          ref={bgImageRef}
          className="absolute inset-0 w-full h-full"
          style={{ willChange: 'transform' }}
        >
          <img
            src={backgroundImage}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
            width={1920}
            height={1080}
            loading="eager"
            style={{ transform: 'scale(1.15)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight-ink/70 via-midnight-ink/18 to-midnight-ink/82" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 pb-8 pt-24">
          {/* Title */}
          <div ref={titleRef} className="relative z-20 mb-8 w-full max-w-7xl text-center">
            <p className="hero-title-line mb-5 font-utility text-xs font-semibold uppercase text-white drop-shadow-[0_8px_22px_rgba(0,0,0,0.45)]">
              政企资源赋能 / AI务实出海
            </p>
            <h1 className="mx-auto flex max-w-full flex-wrap justify-center font-utility text-[clamp(2.6rem,9.5vw,8.6rem)] font-semibold leading-[0.9] text-white drop-shadow-[0_22px_48px_rgba(0,0,0,0.28)]">
              {title.split('').map((letter, i) => (
                <span
                  key={i}
                  className="hero-title-line inline-block"
                  style={{ willChange: 'transform, opacity' }}
                >
                  {letter}
                </span>
              ))}
            </h1>
            <div className="mx-auto mt-7 max-w-4xl space-y-3">
              <p className="hero-title-line text-safe mx-auto max-w-[min(42rem,88vw)] font-utility text-[clamp(1rem,4.8vw,2.25rem)] font-semibold leading-tight text-white text-balance drop-shadow-[0_10px_28px_rgba(0,0,0,0.5)]">
                {subtitle1}
              </p>
              <p className="hero-title-line text-safe mx-auto max-w-[min(38rem,86vw)] font-utility text-[clamp(0.95rem,3.8vw,1.3rem)] font-medium leading-relaxed text-white drop-shadow-[0_8px_22px_rgba(0,0,0,0.45)]">
                {subtitle2}
              </p>
            </div>
          </div>

          {/* Cards */}
          <div
            ref={cardsRef}
            className="relative mx-auto mb-8 aspect-[3/4] w-full max-w-[min(22rem,74vw)] perspective-1000"
            style={{ willChange: 'transform, opacity' }}
          >
            {cards.map((card, i) => (
              <Card3D
                key={i}
                image={card.image}
                bubble={card.bubble}
                index={i}
                isActive={i === 0}
              />
            ))}
          </div>

          {/* Indicators */}
          <div ref={indicatorsRef} className="flex justify-center gap-2" aria-label="首屏3D卡片进度">
            {cards.map((_, i) => (
              <button
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === 0 ? 'bg-foudre-pink w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
