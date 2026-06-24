'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface AgencyProps {
  leftText: string
  rightText: string
  videoUrl: string
}

export default function Agency({ leftText, rightText, videoUrl }: AgencyProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const leftTextRef = useRef<HTMLDivElement>(null)
  const rightTextRef = useRef<HTMLDivElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const bgTransitionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          pin: stickyRef.current,
          scrub: 0.5,
          pinSpacing: true,
        },
      })

      // Phase 1: 背景过渡 + 视频容器滑入 (0% - 30%)
      tl.fromTo(
        bgTransitionRef.current,
        { opacity: 0 },
        { opacity: 1, ease: 'none' },
        0
      )

      tl.fromTo(
        videoContainerRef.current,
        { y: 150, scale: 0.85, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, ease: 'power2.out' },
        0
      )

      // Phase 2: 左右文字滑入 (20% - 45%)
      tl.fromTo(
        leftTextRef.current,
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0.2
      )

      tl.fromTo(
        rightTextRef.current,
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0.2
      )

      // Phase 3: 内容视差 + 淡出 (45% - 100%)
      tl.to(
        leftTextRef.current,
        { y: -60, opacity: 0, ease: 'power2.in' },
        0.45
      )

      tl.to(
        rightTextRef.current,
        { y: -60, opacity: 0, ease: 'power2.in' },
        0.45
      )

      tl.to(
        videoContainerRef.current,
        { y: -80, scale: 0.9, opacity: 0, ease: 'power2.in' },
        0.5
      )

      // 红色覆盖层保持完全透明，避免粉色空白
      tl.to(
        overlayRef.current,
        { scaleY: 1, opacity: 0, ease: 'power2.out' },
        0.6
      )

      // 背景过渡层保持 ash-whisper 颜色，与 Team section 背景一致
      tl.to(
        bgTransitionRef.current,
        { opacity: 1, ease: 'none' },
        0.8
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative w-full" style={{ height: '300vh' }}>
      <div
        ref={stickyRef}
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
        style={{ willChange: 'transform' }}
      >
        {/* Background Transition Overlay */}
        <div
          ref={bgTransitionRef}
          className="absolute inset-0 bg-pale-canvas"
          style={{ opacity: 0 }}
        />

        {/* Original Background */}
        <div className="absolute inset-0 bg-pale-canvas" />
        <div className="absolute inset-x-6 top-10 border-t border-deep-forest/10" />
        <div className="absolute inset-x-6 bottom-10 border-t border-deep-forest/10" />

        {/* Red Overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-foudre-pink origin-bottom"
          style={{ willChange: 'transform', transform: 'scaleY(0)', opacity: 0 }}
        />

        {/* Content */}
        <div className="relative z-10 grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 lg:grid-cols-[0.8fr_1.4fr_0.8fr]">
          {/* Left Text */}
          <div
            ref={leftTextRef}
            className="max-w-xs"
            style={{ willChange: 'transform, opacity' }}
          >
            <p className="editorial-kicker mb-3">Operating Thesis</p>
            <p className="font-utility text-heading font-semibold text-deep-forest text-balance">
              {leftText}
            </p>
          </div>

          {/* Video Player */}
          <div
            ref={videoContainerRef}
            className="relative"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="neo-surface relative aspect-video overflow-hidden rounded-content bg-black p-1 shadow-[0_30px_90px_rgba(16,35,31,0.16)]">
              <iframe
                src={videoUrl}
                className="h-full w-full rounded-[6px]"
                allow="autoplay; fullscreen"
                allowFullScreen
                title="Company Video"
              />
            </div>
          </div>

          {/* Right Text */}
          <div
            ref={rightTextRef}
            className="ml-auto max-w-xs"
            style={{ willChange: 'transform, opacity' }}
          >
            <p className="font-utility text-heading font-semibold text-deep-forest text-right text-balance">
              {rightText}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
