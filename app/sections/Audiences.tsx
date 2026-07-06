'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Reveal from '../components/Reveal'
import AnimatedText from '../components/AnimatedText'

gsap.registerPlugin(ScrollTrigger)

const audiences = [
  {
    key: 'factory',
    label: '工厂老板',
    quote: '你厂里的货我知道能卖出去，不用先付几万块。我们先帮你做内容、找买家，订单落定了再谈合作。迪拜3亿、香港带货15万港币，都是先干出来的。',
  },
  {
    key: 'partner',
    label: '出海服务商',
    quote: '你们有客户但做不了AI获客？我们做后端交付——AI内容生产、账号矩阵、GEO占位，你接前端客户，我们做技术交付，分成合作。',
  },
]

export default function Audiences() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.audience-card').forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'expo.out',
            scrollTrigger: { trigger: card, start: 'top 88%', once: true },
            delay: index * 0.1,
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="audience" className="p-section border-t border-[#E5E5E0] bg-[#F0EFEC] py-24 md:py-32">
      <div className="p-inner">
        <div className="mb-16 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="p-kicker mb-6">Who We Serve</p>
            </Reveal>
            <AnimatedText as="h2" className="p-heading-xl">
              跟不同的人，说不同的话。
            </AnimatedText>
          </div>
        </div>

        <div className="audience-tabs grid gap-px bg-[#E5E5E0] lg:grid-cols-2">
          {audiences.map((audience, index) => (
            <article
              key={audience.key}
              className={`audience-card relative min-h-[320px] border border-[#E5E5E0] p-8 md:p-12 ${
                index === 0 ? 'active bg-[#0F1C1A] text-white' : 'bg-white text-[#0F1C1A]'
              }`}
            >
              <span className={`absolute right-6 top-6 font-mono text-6xl font-semibold ${index === 0 ? 'text-white/10' : 'text-[#E5E5E0]'}`}>
                {audience.key.slice(0, 2).toUpperCase()}
              </span>
              <h3 className={`p-heading mb-8 ${index === 0 ? 'text-white' : 'text-[#0F1C1A]'}`}>{audience.label}</h3>
              <p className={`relative z-10 text-2xl font-medium leading-snug md:text-3xl ${index === 0 ? 'text-white' : 'text-[#0F1C1A]'}`}>
                &ldquo;{audience.quote}&rdquo;
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
