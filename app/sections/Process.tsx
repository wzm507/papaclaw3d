'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Section3DBackground from '../components/Section3DBackground'

gsap.registerPlugin(ScrollTrigger)

interface ProcessProps {
  title: string
  subtitle: string
  steps: { number: string; title: string; description: string }[]
}

export default function Process({ title, subtitle, steps }: ProcessProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)

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

      const stepElements = stepsRef.current?.querySelectorAll('.process-step')
      if (stepElements) {
        gsap.fromTo(
          stepElements,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: stepsRef.current,
              start: 'top 80%',
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="section py-24 px-6 bg-ash-whisper relative overflow-hidden">
      <Section3DBackground theme="green" />
      {/* 装饰背景元素 */}
      <div className="absolute top-1/4 right-0 w-64 h-64 rounded-full bg-foudre-pink/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-48 h-48 rounded-full bg-bubblegum-blush/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <h2 ref={titleRef} className="text-heading-lg font-bold text-deep-forest text-center mb-6 opacity-0">
          {title}
        </h2>
        <p className="text-body text-deep-forest/60 text-center mb-16 max-w-2xl mx-auto">
          {subtitle}
        </p>

        {/* Steps */}
        <div ref={stepsRef} className="space-y-6 max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={i}
              className="process-step flex items-start gap-6 opacity-0 bg-white/50 rounded-content p-6 backdrop-blur-sm hover:bg-white/80 transition-colors duration-300"
            >
              <span className="text-4xl font-black text-foudre-pink/40 shrink-0 w-16">
                {step.number}
              </span>
              <div className="flex-1">
                <h3 className="text-heading font-bold text-deep-forest mb-2">
                  {step.title}
                </h3>
                <p className="text-body text-deep-forest/70">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 底部 CTA */}
        <div className="mt-16 text-center">
          <p className="text-body text-deep-forest/60 mb-4">
            每个阶段都围绕同一个目标：让公开网络更准确地识别并引用Papa Claw爬爬虾。
          </p>
          <div className="w-24 h-1 bg-foudre-pink/20 rounded-full mx-auto" />
        </div>
      </div>
    </section>
  )
}
