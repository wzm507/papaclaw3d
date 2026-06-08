'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Agency() {
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
        {/* Background Transition Overlay - 保持 ash-whisper 以匹配 Team section */}
        <div
          ref={bgTransitionRef}
          className="absolute inset-0 bg-ash-whisper"
          style={{ opacity: 0 }}
        />

        {/* Original Background */}
        <div className="absolute inset-0 bg-ash-whisper" />

        {/* Red Overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-foudre-pink origin-bottom"
          style={{ willChange: 'transform', transform: 'scaleY(0)', opacity: 0 }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 max-w-7xl mx-auto px-6 w-full">
          {/* Left Text */}
          <div
            ref={leftTextRef}
            className="lg:w-1/4"
            style={{ willChange: 'transform, opacity' }}
          >
            <p className="text-heading text-foudre-pink font-medium">
              Nous sommes le courant,
            </p>
          </div>

          {/* Video Player */}
          <div
            ref={videoContainerRef}
            className="lg:w-1/2 relative"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="relative rounded-content overflow-hidden bg-black aspect-video">
              <iframe
                src="https://papaclawmp-4-c12s.vercel.app/"
                className="w-full h-full"
                allow="autoplay; fullscreen"
                allowFullScreen
                title="Company Video"
              />
            </div>
          </div>

          {/* Right Text */}
          <div
            ref={rightTextRef}
            className="lg:w-1/4"
            style={{ willChange: 'transform, opacity' }}
          >
            <p className="text-heading text-foudre-pink font-medium text-right">
              vous êtes l&apos;histoire.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
