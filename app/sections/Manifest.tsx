'use client'

import { useEffect, useRef, Suspense, lazy, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Manifest3D = lazy(() => import('../components/Manifest3D'))

// 错误边界组件
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = () => {
      setHasError(true)
    }
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    return null
  }

  return <>{children}</>
}

export default function Manifest() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const lightningLeftRef = useRef<SVGSVGElement>(null)
  const lightningRightRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    // 检查用户是否偏好减少动画
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // Text animation - 保留作为 fallback
      const words = textRef.current?.querySelectorAll('.manifest-word')
      if (words) {
        gsap.fromTo(
          words,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              end: 'bottom 40%',
              scrub: 1,
            },
          }
        )
      }

      // Lightning animation - 保留作为 fallback
      if (!prefersReducedMotion) {
        gsap.to(lightningLeftRef.current, {
          x: -50,
          rotation: -15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })

        gsap.to(lightningRightRef.current, {
          x: 50,
          rotation: 15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="section relative flex min-h-screen items-center justify-center overflow-hidden bg-midnight-ink px-6 py-24"
    >
      {/* 3D Background */}
      <ErrorBoundary>
        <Suspense fallback={null}>
          <Manifest3D />
        </Suspense>
      </ErrorBoundary>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)`,
          backgroundSize: '56px 56px',
        }} />
      </div>

      {/* Left Lightning */}
      <svg
        ref={lightningLeftRef}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-48 h-96 text-bubblegum-blush/12 pointer-events-none"
        viewBox="0 0 100 200"
        fill="currentColor"
      >
        <path d="M60 0L40 80L80 100L20 200L50 100L10 80Z" />
      </svg>

      {/* Right Lightning */}
      <svg
        ref={lightningRightRef}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-96 text-bubblegum-blush/12 pointer-events-none"
        viewBox="0 0 100 200"
        fill="currentColor"
      >
        <path d="M40 0L60 80L20 100L80 200L50 100L90 80Z" />
      </svg>

      {/* Text Content */}
      <div className="absolute inset-x-6 top-10 border-t border-white/12" />
      <div ref={textRef} className="relative z-10 text-center max-w-5xl mx-auto">
        <p className="font-utility text-caption font-semibold uppercase text-white/55 mb-6">Operating Manifesto</p>
        <p className="font-utility text-heading text-white mb-5 overflow-hidden">
          <span className="manifest-word inline-block">不靠直觉做判断。</span>
        </p>
        <p className="font-utility text-heading text-white mb-5 overflow-hidden">
          <span className="manifest-word inline-block">数据在哪里，市场就在哪里。</span>
        </p>
        <h2 className="overflow-hidden my-8 font-utility text-display font-semibold text-bubblegum-blush">
          <span className="manifest-word inline-block">AI务实出海</span>
        </h2>
        <h2 className="overflow-hidden font-utility text-display font-semibold text-white">
          <span className="manifest-word inline-block">结果落地</span>
        </h2>
      </div>
    </section>
  )
}
