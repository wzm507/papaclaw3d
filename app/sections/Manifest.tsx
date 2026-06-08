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
      className="section min-h-screen flex items-center justify-center py-24 px-6 overflow-hidden relative bg-pale-canvas"
    >
      {/* 3D Background */}
      <ErrorBoundary>
        <Suspense fallback={null}>
          <Manifest3D />
        </Suspense>
      </ErrorBoundary>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L35 25L60 30L35 35L30 60L25 35L0 30L25 25Z' fill='%2300522d'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Left Lightning */}
      <svg
        ref={lightningLeftRef}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-48 h-96 text-foudre-pink/20 pointer-events-none"
        viewBox="0 0 100 200"
        fill="currentColor"
      >
        <path d="M60 0L40 80L80 100L20 200L50 100L10 80Z" />
      </svg>

      {/* Right Lightning */}
      <svg
        ref={lightningRightRef}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-96 text-foudre-pink/20 pointer-events-none"
        viewBox="0 0 100 200"
        fill="currentColor"
      >
        <path d="M40 0L60 80L20 100L80 200L50 100L90 80Z" />
      </svg>

      {/* Text Content */}
      <div ref={textRef} className="relative z-10 text-center max-w-4xl mx-auto">
        <p className="text-heading text-deep-forest mb-4 overflow-hidden">
          <span className="manifest-word inline-block">C&apos;est</span>{' '}
          <span className="manifest-word inline-block">l&apos;impact</span>{' '}
          <span className="manifest-word inline-block">de</span>{' '}
          <span className="manifest-word inline-block">votre</span>{' '}
          <span className="manifest-word inline-block">sincérité</span>
        </p>
        <p className="text-heading text-deep-forest mb-4 overflow-hidden">
          <span className="manifest-word inline-block">C&apos;est</span>{' '}
          <span className="manifest-word inline-block">viser</span>{' '}
          <span className="manifest-word inline-block">juste</span>{' '}
          <span className="manifest-word inline-block">et</span>
        </p>
        <h2 className="text-display font-black text-foudre-pink overflow-hidden my-8">
          <span className="manifest-word inline-block">FRAPPER</span>
        </h2>
        <h2 className="text-display font-black text-deep-forest overflow-hidden">
          <span className="manifest-word inline-block">FORT.</span>
        </h2>
      </div>
    </section>
  )
}
