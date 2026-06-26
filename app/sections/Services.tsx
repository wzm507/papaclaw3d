'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Reveal from '../components/Reveal'
import AnimatedText from '../components/AnimatedText'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    index: '01',
    title: 'VIBE MARKETING',
    subtitle: '出海媒体',
    desc: 'AI 原生本土化品牌营销、社媒代运营、品牌视觉包装。不是让用户觉得"被营销了"，是让他们觉得"这个品牌懂我"。',
  },
  {
    index: '02',
    title: 'CROSS-BORDER INTELLIGENCE',
    subtitle: '跨境智库',
    desc: 'AI 24 小时抓取全球商机，不靠人工盲目筛选。不是等客户找你，是客户来找你。',
  },
  {
    index: '03',
    title: 'STRATEGIC ADVISORY',
    subtitle: '品牌战略咨询',
    desc: '不靠拍脑袋决策，以数据 + 行业行家 + 本地专家三方验证，做可持续落地的出海规划。',
  },
  {
    index: '04',
    title: 'GOVERNMENT & ENTERPRISE',
    subtitle: '政企对接',
    desc: '南沙 — 港澳 — 海外全域政企资源对接。政策红利不是天上掉下来的，是有人知道去哪拿、怎么拿、拿多少。',
  },
  {
    index: '05',
    title: 'FINANCIAL SERVICES',
    subtitle: '跨境金融',
    desc: '跨境合规结算、供应链金融、投融资对接。出海企业不缺订单，缺的是让资金安全、快速流转的通道。',
  },
]

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.service-card').forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'expo.out',
            scrollTrigger: { trigger: card, start: 'top 85%', once: true },
            delay: index * 0.1,
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="services" className="section bg-pale-canvas py-24 md:py-32">
      <div className="section-inner">
        <div className="mb-16 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="kicker mb-6">Five Service Lines</p>
            </Reveal>
            <AnimatedText as="h2" className="heading-lg">
              你要做出海，我们全部能落地。
            </AnimatedText>
            <Reveal delay={0.2}>
              <p className="body-text mt-6 max-w-2xl">
                别家只做其中一块，或者只给方案不做落地。我们五大板块全覆盖，从找商机到拿订单到资金回流，全链路贴身服务。
              </p>
            </Reveal>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.index}
              className="service-card group relative flex flex-col justify-between card-surface p-6 transition-all duration-500 hover:-translate-y-1 hover:border-deep-forest md:p-8"
            >
              <div>
                <div className="mb-8 flex items-start justify-between">
                  <span className="font-mono text-xs text-slate-tint">{service.index}</span>
                  <span className="h-8 w-8 rounded-full border border-ash-whisper bg-pale-canvas transition-all duration-300 group-hover:rotate-45 group-hover:border-deep-forest group-hover:bg-deep-forest" />
                </div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-slate-tint">{service.title}</p>
                <h3 className="heading mb-4">{service.subtitle}</h3>
                <p className="body-text">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
