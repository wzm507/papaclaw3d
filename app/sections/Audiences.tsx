'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Reveal from '../components/Reveal'
import AnimatedText from '../components/AnimatedText'

gsap.registerPlugin(ScrollTrigger)

const audiences = [
  {
    key: 'factory',
    label: 'C 端 · 工厂老板',
    quote: '你厂里的货我知道能卖出去，但我不需要你先付几万块。我们先帮你做内容、先帮你找买家，你拿到订单了，我们再谈合作。',
  },
  {
    key: 'government',
    label: 'B 端 · 政府及政企项目',
    quote: '我们不是来拿补贴的，我们是来帮你把项目落地、帮你去拿订单的。南沙、港澳、中东，我们三地都有人。',
  },
  {
    key: 'investor',
    label: '投资人',
    quote: '我们 6 个人，低成本运营，但操盘过十几亿。我们不烧钱铺摊子，我们先用结果证明我们能赚钱。',
  },
  {
    key: 'media',
    label: '媒体',
    quote: '出海不是干一件大事，是做好很多小事。我们做的事很简单 — 帮中国企业把货卖到海外，帮中国文化在海外被看见。',
  },
]

export default function Audiences() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.audience-tab').forEach((tab, index) => {
        gsap.fromTo(
          tab,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'expo.out',
            scrollTrigger: { trigger: tab, start: 'top 88%', once: true },
            delay: index * 0.08,
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="audience" className="section bg-warm-gray py-24 md:py-32">
      <div className="section-inner">
        <div className="mb-16 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="kicker mb-6">Audience Pitch</p>
            </Reveal>
            <AnimatedText as="h2" className="heading-lg">
              跟不同的人说话，要用不同的语言。
            </AnimatedText>
            <Reveal delay={0.2}>
              <p className="body-text mt-6">一套话术走天下，是最低级的销售。我们为四类受众分别准备了标准话术，确保每一次对外表达都一致、精准、有杀伤力。</p>
            </Reveal>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-2 lg:col-span-4">
            {audiences.map((audience, index) => (
              <button
                key={audience.key}
                onClick={() => setActive(index)}
                className={`audience-tab block w-full rounded-content border px-5 py-4 text-left font-sans text-sm font-medium transition-all duration-300 ${
                  active === index
                    ? 'border-deep-forest bg-deep-forest text-paper-white'
                    : 'border-ash-whisper bg-paper-white text-deep-forest hover:border-deep-forest'
                }`}
              >
                {audience.label}
              </button>
            ))}
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal delay={0.3}>
              <div className="relative min-h-[280px] card-surface p-8 md:p-12">
                <span className="absolute right-6 top-6 font-mono text-6xl font-semibold text-ash-whisper">{audiences[active].key.slice(0, 2).toUpperCase()}</span>                <p className="mb-6 font-mono text-xs uppercase tracking-widest text-foudre-pink">{audiences[active].label}</p>
                <p className="relative z-10 font-display text-2xl font-medium leading-snug text-deep-forest md:text-3xl">
                  &ldquo;{audiences[active].quote}&rdquo;
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
