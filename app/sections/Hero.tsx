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

      tl.fromTo(
        titleRef.current?.querySelectorAll('.hero-title-line') || [],
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, ease: 'power2.out' },
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
        className="relative w-full h-screen overflow-hidden"
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/65" />
          <div className="absolute inset-0 bg-deep-forest/20 mix-blend-multiply" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 pt-24 pb-8">
          {/* Title */}
          <div ref={titleRef} className="relative z-20 text-center mb-10 max-w-6xl">
            <p className="hero-title-line editorial-kicker mb-5 text-white/80">
              政企资源赋能 / AI务实出海
            </p>
            <h1 className="text-display font-bold text-white">
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
            <div className="mx-auto mt-6 max-w-4xl space-y-3 border-y border-white/25 py-5">
              <p className="hero-title-line font-editorial text-heading font-bold text-white/95 text-balance">
                {subtitle1}
              </p>
              <p className="hero-title-line font-utility text-subheading font-semibold text-white/78">
                {subtitle2}
              </p>
            </div>
          </div>

          {/* Cards */}
          <div
            ref={cardsRef}
            className="relative w-full max-w-md mx-auto aspect-[3/4] mb-8 perspective-1000"
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
