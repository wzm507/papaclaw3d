'use client'

import Reveal from '../components/Reveal'
import AnimatedText from '../components/AnimatedText'
import Counter from '../components/Counter'

interface AboutProps {
  leftText: string
  rightText: string
  videoUrl?: string
}

export default function About({ leftText, rightText }: AboutProps) {
  return (
    <section id="about" className="section bg-pale-canvas py-24 md:py-32">
      <div className="section-inner">
        <Reveal>
          <p className="kicker mb-6">Positioning</p>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <AnimatedText as="h2" className="heading-lg">
              出海不是先组队。是先拿到第一个订单。
            </AnimatedText>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.2}>
              <p className="body-text text-lg leading-relaxed">{leftText}</p>
              <p className="body-text mt-6 text-lg leading-relaxed">{rightText}</p>
            </Reveal>
          </div>
        </div>

        <div className="mt-24 grid gap-px bg-ash-whisper md:grid-cols-3">
          {[
            { value: 14, suffix: '年', label: '中东深耕经验' },
            { value: 3, suffix: '亿', prefix: '¥', label: '9 个月协助客户成交' },
            { value: 6, suffix: '人', label: '精干团队 · 低成本运营' },
          ].map((stat) => (
            <Reveal key={stat.label} delay={0.1}>
              <div className="group relative bg-pale-canvas p-8 transition-colors duration-500 hover:bg-warm-gray md:p-12">
                <p className="font-display text-5xl font-semibold text-deep-forest md:text-6xl">
                  <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} duration={1.8} />
                </p>
                <p className="mt-3 font-sans text-sm text-slate-tint">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
