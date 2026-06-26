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
    desc: '从品牌视频到社媒日常，再到海外获客体系，整套新媒体营销跟着客户一起跑。',
    result: '9 个月，累计帮客户成交 ¥3 亿',
  },
  {
    category: '跨境直播 · 香港',
    title: '香港跨境直播主播',
    desc: '搭 ERP、做短视频、管 30 多个社媒账号，把直播这条链路跑通。',
    result: '单条互动 5,000+，直播在线 1,000+，粉丝 4 万+',
  },
  {
    category: '服装贸易 · 香港',
    title: '南油女装出海项目',
    desc: '帮客户把女装铺进香港市场，从渠道到销售完整跑通。',
    result: '成交数千单，GMV 100 万+',
  },
  {
    category: '珠宝 · 中东 / 东南亚',
    title: '番禺珠宝出海项目',
    desc: '珠宝卖到香港、迪拜、沙特、马来西亚，持续出单。',
    result: '成交数百单，持续运营中',
  },
  {
    category: '政府项目 · 南沙',
    title: '南沙跨境贸易产业集聚区',
    desc: '宣传手册、展厅布置、营销策划、文件准备，全流程跟着项目落地。',
    result: '政府项目官方合作，持续服务中',
  },
  {
    category: '文化传播 · 全球',
    title: '影像中国 · 非遗文化出海',
    desc: '用 AI 剪片子、做内容，把中国非遗推到海外社媒上。',
    result: '剪了 400 多条片子，管 30+ 账号，单条最高播放 10 万+',
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
            scrollTrigger: { trigger: row, start: 'top 90%', once: true },
            delay: index * 0.06,
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="cases" className="p-section border-t border-[#E5E5E0] bg-[#F7F7F5] py-24 md:py-32">
      <div className="p-inner">
        <div className="mb-16 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="p-kicker mb-6">Real Results</p>
            </Reveal>
            <AnimatedText as="h2" className="p-heading-xl">
              能帮客户赚到钱，是最实在的能力。
            </AnimatedText>
          </div>
        </div>

        <div className="border-t border-[#E5E5E0]">
          {cases.map((item, index) => (
            <div
              key={item.title}
              className="case-row cursor-pointer border-b border-[#E5E5E0] transition-colors duration-300 hover:bg-[#F0EFEC]"
              onMouseEnter={() => setActive(index)}
            >
              <div className="grid items-start gap-4 px-2 py-8 md:grid-cols-12 md:gap-8 md:py-10">
                <div className="md:col-span-3">
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-[#737373]">{item.category}</span>
                </div>
                <div className="md:col-span-4">
                  <h3 className="p-heading">{item.title}</h3>
                </div>
                <div className="md:col-span-5">
                  <p className="p-body mb-3">{item.desc}</p>
                  <p className={`text-sm font-semibold transition-colors ${active === index ? 'text-[#B08D57]' : 'text-[#0F1C1A]'}`}>
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
