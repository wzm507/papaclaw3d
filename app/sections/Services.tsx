'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Reveal from '../components/Reveal'
import AnimatedText from '../components/AnimatedText'

gsap.registerPlugin(ScrollTrigger)

const flagshipServices = [
  {
    title: 'AI内容生产',
    desc: '视频/图文/社媒帖子，AI批量生成+人工精修。已产出数百条海外内容。',
  },
  {
    title: '账号矩阵运营',
    desc: 'YouTube/Instagram/TikTok/Facebook/LinkedIn多平台分发。30+账号矩阵管理经验。',
  },
  {
    title: 'AI线索挖掘与转化',
    desc: '用AI筛选海外采购需求、社媒互动和潜在客户信号，输出客户名单、触达话术和跟进优先级。',
  },
]

const addOnServices = [
  {
    title: '跨境智库',
    desc: 'AI 24小时抓全球标讯和采购需求，不用人工一页页翻。',
  },
  {
    title: '品牌战略咨询',
    desc: '用数据、行业经验和本地专家三方验证，做出能落地的出海规划。',
  },
  {
    title: '政企对接',
    desc: '南沙、港澳、海外三地政企资源对接。政策红利知道去哪拿、怎么拿。',
  },
  {
    title: '跨境金融',
    desc: '跨境合规结算、供应链金融、投融资对接。',
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
        <section className="flagship-service service-card border-y border-[#0F1C1A] py-10 md:py-14">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="p-kicker mb-6">Flagship</p>
              </Reveal>
              <AnimatedText as="h2" className="p-heading-xl">
                AI出海获客引擎
              </AnimatedText>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={0.2}>
                <p className="p-body-lg max-w-3xl text-[#0F1C1A]">
                  用AI批量生产本土化内容 + 运营多平台账号矩阵 + AI线索挖掘与转化，让海外客户主动找到你。按结果付费，你赚不到钱我们只收工时费。
                </p>
              </Reveal>
            </div>
          </div>

          <div className="flagship-grid mt-12 grid gap-px bg-[#E5E5E0] md:grid-cols-3">
            {flagshipServices.map((service, index) => (
              <div key={service.title} className="bg-white p-6 md:min-h-[220px] md:p-8">
                <span className="p-caption mb-10 block">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="p-heading mb-4">{service.title}</h3>
                <p className="p-body">{service.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="add-on-services service-card mt-14">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="p-kicker mb-6">Add-on Services</p>
              </Reveal>
              <h2 className="p-heading-lg">除了获客，我们还能做更多</h2>
            </div>
            <div className="lg:col-span-7">
              <details className="group">
                <summary className="grid cursor-pointer list-none gap-6 border border-[#0F1C1A] bg-white p-6 text-left transition-colors duration-300 hover:bg-[#F0EFEC] md:grid-cols-[1fr_auto] md:items-center md:p-8">
                  <div>
                    <span className="p-caption mb-3 block text-[#B08D57]">Click to expand</span>
                    <h3 className="p-heading mb-3">查看4条增值服务</h3>
                    <p className="p-body max-w-2xl">跨境智库 / 品牌战略咨询 / 政企对接 / 跨境金融，按项目需要再叠加。</p>
                  </div>
                  <span className="inline-flex w-fit items-center gap-3 border border-[#0F1C1A] bg-[#0F1C1A] px-4 py-3 text-sm font-semibold text-white transition-colors duration-300 group-open:bg-[#B08D57] group-open:border-[#B08D57]">
                    <span className="group-open:hidden">点击展开</span>
                    <span className="hidden group-open:inline">已展开</span>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-white/30 text-white transition-transform duration-300 group-open:rotate-45">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  </span>
                </summary>
                <div className="add-on-grid grid gap-px bg-[#E5E5E0] border-x border-b border-[#0F1C1A] md:grid-cols-2">
                  {addOnServices.map((service) => (
                    <div key={service.title} className="bg-[#F7F7F5] p-6 md:p-8">
                      <h3 className="p-heading mb-4">{service.title}</h3>
                      <p className="p-body">{service.desc}</p>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}
