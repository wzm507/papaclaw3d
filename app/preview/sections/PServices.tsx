'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PReveal from '../components/PReveal'
import PAnimatedText from '../components/PAnimatedText'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    index: '01',
    title: 'VIBE MARKETING',
    subtitle: '出海媒体',
    desc: 'AI 做本土化内容、社媒代运营、品牌视觉包装。让用户不觉得被推销，而是觉得这个品牌懂他。',
  },
  {
    index: '02',
    title: 'CROSS-BORDER INTELLIGENCE',
    subtitle: '跨境智库',
    desc: 'AI 24 小时抓全球标讯和采购需求，不用人工一页页翻。让潜在客户主动找到你。',
  },
  {
    index: '03',
    title: 'STRATEGIC ADVISORY',
    subtitle: '品牌战略咨询',
    desc: '不拍脑袋。用数据、行业经验和本地专家三方验证，做出能真正落地的出海规划。',
  },
  {
    index: '04',
    title: 'GOVERNMENT & ENTERPRISE',
    subtitle: '政企对接',
    desc: '南沙、港澳、海外三地政企资源对接。政策红利不是等来的，得知道去哪拿、怎么拿、拿多少。',
  },
  {
    index: '05',
    title: 'FINANCIAL SERVICES',
    subtitle: '跨境金融',
    desc: '跨境合规结算、供应链金融、投融资对接。很多企业不是缺订单，是缺一条安全快速的资金通道。',
  },
]

export default function PServices() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.p-service-card').forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'expo.out',
            scrollTrigger: { trigger: card, start: 'top 88%', once: true },
            delay: index * 0.08,
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="services" className="p-section border-t border-[#E5E5E0] bg-[#F7F7F5] py-24 md:py-32">
      <div className="p-inner">
        <div className="mb-16 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <PReveal>
              <p className="p-kicker mb-6">Five Service Lines</p>
            </PReveal>
            <PAnimatedText as="h2" className="p-heading-xl">
              你要做出海，我们全链路落地。
            </PAnimatedText>
            <PReveal delay={0.2}>
              <p className="p-body-lg mt-6 max-w-2xl">
                别家往往只做一块，或者只出方案不落地。我们覆盖从找商机、拿订单到资金回流的完整链路，从头到尾跟着做。
              </p>
            </PReveal>
          </div>
        </div>

        <div className="grid gap-px border-t border-[#E5E5E0] bg-[#E5E5E0] md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.index}
              className="p-service-card group relative flex flex-col justify-between bg-[#F7F7F5] p-6 transition-colors duration-500 hover:bg-[#F0EFEC] md:p-8"
            >
              <div>
                <div className="mb-10 flex items-start justify-between">
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-[#737373]">{service.index}</span>
                  <span className="flex h-8 w-8 items-center justify-center border border-[#E5E5E0] bg-white text-[#0F1C1A] transition-all duration-300 group-hover:rotate-45 group-hover:border-[#0F1C1A] group-hover:bg-[#0F1C1A] group-hover:text-white">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
                <p className="mb-2 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-[#737373]">{service.title}</p>
                <h3 className="p-heading mb-4">{service.subtitle}</h3>
                <p className="p-body">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
