'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Reveal from '../components/Reveal'
import AnimatedText from '../components/AnimatedText'

gsap.registerPlugin(ScrollTrigger)

const cases = [
  {
    category: '房地产 · 中东',
    title: '中东头部房地产开发商',
    desc: '提供新媒体营销全案服务，包括品牌视频制作、社媒内容运营、海外获客体系搭建。',
    result: '9 个月，协助客户完成累计成交金额 ¥3 亿人民币',
  },
  {
    category: '跨境直播 · 香港',
    title: '香港跨境直播主播',
    desc: '搭建海外直播运营体系，包括 ERP 系统部署、短视频内容制作、30+ 社媒账号日常运营。',
    result: '单条视频互动突破 5,000+，直播间同时在线 1,000+，粉丝 40,000+',
  },
  {
    category: '服装贸易 · 香港',
    title: '南油女装出海项目',
    desc: '帮助客户将产品卖到香港市场，搭建完整出海销售渠道。',
    result: '成交数千单，GMV 100 万+',
  },
  {
    category: '珠宝 · 中东 / 东南亚',
    title: '番禺珠宝出海项目',
    desc: '帮助客户将珠宝产品卖到香港、迪拜、沙特、马来西亚。',
    result: '成交数百单，持续运营中',
  },
  {
    category: '政府项目 · 南沙',
    title: '南沙跨境贸易产业集聚区',
    desc: '为企业提供宣传手册、展厅布置、营销策划、文件准备等全流程落地服务。',
    result: '政府项目官方合作，持续服务中',
  },
  {
    category: '文化传播 · 全球',
    title: '影像中国 · 非遗文化出海',
    desc: '用 AI 内容生产能力，帮中国非遗文化在海外社媒传播，让外国人看到真正的中国。',
    result: '发布剪辑超过 400 条片子，管理 30+ 账号，单条最高播放 10 万+',
  },
]

export default function Cases() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.case-row').forEach((row, index) => {
        gsap.fromTo(
          row,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'expo.out',
            scrollTrigger: { trigger: row, start: 'top 88%', once: true },
            delay: index * 0.08,
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="cases" className="section bg-pale-canvas py-24 md:py-32">
      <div className="section-inner">
        <div className="mb-16 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="kicker mb-6">Real Results</p>
            </Reveal>
            <AnimatedText as="h2" className="heading-lg">
              帮客户赚到钱的能力，是一个很性感的能力。
            </AnimatedText>
          </div>
        </div>

        <div className="space-y-0">
          {cases.map((item, index) => (
            <div
              key={item.title}
              className="case-row cursor-pointer border-b border-ash-whisper transition-colors duration-300 hover:bg-warm-gray"
              onMouseEnter={() => setActive(index)}
            >
              <div className="grid items-start gap-4 px-2 py-8 md:grid-cols-12 md:gap-8 md:py-10">
                <div className="md:col-span-3">
                  <span className="font-mono text-xs uppercase tracking-widest text-slate-tint">{item.category}</span>
                </div>
                <div className="md:col-span-4">
                  <h3 className="font-display text-xl font-semibold text-deep-forest md:text-2xl">{item.title}</h3>
                </div>
                <div className="md:col-span-5">
                  <p className="body-text mb-3">{item.desc}</p>
                  <p className={`font-sans text-sm font-medium transition-colors ${active === index ? 'text-foudre-pink' : 'text-deep-forest'}`}>
                    {item.result}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
