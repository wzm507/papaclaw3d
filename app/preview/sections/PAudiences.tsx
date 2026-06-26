'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PReveal from '../components/PReveal'
import PAnimatedText from '../components/PAnimatedText'

gsap.registerPlugin(ScrollTrigger)

const audiences = [
  {
    key: 'factory',
    label: '工厂老板',
    quote: '你厂里的货我知道能卖出去，不用先付几万块。我们先帮你做内容、找买家，订单落定了再谈合作。',
  },
  {
    key: 'government',
    label: '政府及政企项目',
    quote: '我们不是来拿补贴的，是来帮你把项目落地、把订单拿到的。南沙、港澳、中东，三地都有人。',
  },
  {
    key: 'investor',
    label: '投资人',
    quote: '6 个人，低成本跑，但操盘过十几亿。不烧钱铺摊子，先用结果证明能赚钱。',
  },
  {
    key: 'media',
    label: '媒体',
    quote: '出海不是干一件大事，是把很多小事做好。我们做的事很简单：帮中国企业把货卖到海外，帮中国文化在海外被看见。',
  },
]

export default function PAudiences() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.p-audience-tab').forEach((tab, index) => {
        gsap.fromTo(
          tab,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'expo.out',
            scrollTrigger: { trigger: tab, start: 'top 90%', once: true },
            delay: index * 0.08,
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
            <PReveal>
              <p className="p-kicker mb-6">Audience Pitch</p>
            </PReveal>
            <PAnimatedText as="h2" className="p-heading-xl">
              跟不同的人，说不同的话。
            </PAnimatedText>
            <PReveal delay={0.2}>
              <p className="p-body-lg mt-6">
                一套话术打天下，是最低级的销售。我们按不同对象准备了几套口径，让每次对外表达都说在点上。
              </p>
            </PReveal>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-px lg:col-span-4">
            {audiences.map((audience, index) => (
              <button
                key={audience.key}
                onClick={() => setActive(index)}
                className={`p-audience-tab block w-full border px-5 py-4 text-left text-sm font-medium transition-all duration-300 ${
                  active === index
                    ? 'border-[#0F1C1A] bg-[#0F1C1A] text-white'
                    : 'border-[#E5E5E0] bg-white text-[#0F1C1A] hover:border-[#0F1C1A]'
                }`}
              >
                {audience.label}
              </button>
            ))}
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <PReveal delay={0.3}>
              <div className="relative min-h-[280px] border border-[#E5E5E0] bg-white p-8 md:p-12">
                <span className="absolute right-6 top-6 font-mono text-6xl font-semibold text-[#E5E5E0]">
                  {audiences[active].key.slice(0, 2).toUpperCase()}
                </span>
                <p className="mb-6 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[#B08D57]">{audiences[active].label}</p>
                <p className="relative z-10 text-2xl font-medium leading-snug text-[#0F1C1A] md:text-3xl">
                  &ldquo;{audiences[active].quote}&rdquo;
                </p>
              </div>
            </PReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
