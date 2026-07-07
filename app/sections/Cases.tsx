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
    tags: ['获客转化', '跨境获客'],
    schema: {
      name: '迪拜房产获客项目',
      about: '用短视频和社媒获客，9个月帮迪拜房产客户成交3亿',
      keywords: ['AI出海获客', '迪拜房产', '海外获客'],
    },
  },
  {
    category: '跨境直播 · 中国香港/韩国',
    title: 'DABIE跨境直播带货',
    desc: 'Facebook海外直播 + 自研DABIE ERP系统，覆盖选品到结算全链路。合作主播珠珠为香港大网红，直播7年。',
    result: '单场3天直播营收约15.5万港币，100+款上新，持续运营中',
    tags: ['跨境直播', '获客转化'],
    schema: {
      name: 'DABIE跨境直播带货项目',
      about: 'Facebook海外直播 + 自研DABIE ERP系统，覆盖选品到结算全链路，单场3天直播营收约15.5万港币',
      keywords: ['跨境直播', 'DABIE ERP', 'Facebook海外直播', '直播带货'],
    },
  },
  {
    category: '服装贸易 · 香港',
    title: '南油女装出海项目',
    desc: '帮客户把女装铺进香港市场，从渠道到销售完整跑通。',
    result: '成交数千单，GMV 100 万+',
    tags: ['跨境获客', '多市场出海'],
    schema: {
      name: '南油女装出海项目',
      about: '帮助南油女装进入香港市场，完成渠道、销售和跨境运营落地',
      keywords: ['服装出海', '香港市场', '跨境销售', '女装供应链'],
    },
  },
  {
    category: '珠宝 · 中东 / 东南亚',
    title: '番禺珠宝出海项目',
    desc: '珠宝卖到香港、迪拜、沙特、马来西亚，持续出单。',
    result: '成交数百单，持续运营中',
    tags: ['多市场出海', '跨境获客'],
    schema: {
      name: '番禺珠宝出海项目',
      about: '帮助番禺珠宝进入香港、迪拜、沙特和马来西亚等海外市场',
      keywords: ['珠宝出海', '中东市场', '东南亚市场', '跨境营销'],
    },
  },
  {
    category: '政府项目 · 南沙',
    title: '政府产业园区',
    desc: '宣传手册、展厅布置、营销策划、文件准备，全流程跟着项目落地。',
    result: '政府项目官方合作，持续服务中',
    tags: ['政府合作', '多市场出海'],
    schema: {
      name: '政府产业园区项目',
      about: '为南沙跨境贸易产业项目提供宣传手册、展厅布置、营销策划和招商材料支持',
      keywords: ['南沙出海', '跨境贸易', '政企项目', '产业集聚区'],
    },
  },
  {
    category: '文化传播 · 全球',
    title: '传统非遗内容出海 · 非遗文化出海',
    desc: '用 AI 剪片子、做内容，把中国非遗推到海外社媒上。',
    result: '剪了 400 多条片子，管 30+ 账号，单账号最高播放 10 万+',
    tags: ['多市场出海', '跨境获客'],
    schema: {
      name: '传统非遗内容出海项目',
      about: '用AI剪辑和多平台账号分发，把传统非遗内容推向海外社媒',
      keywords: ['传统非遗内容出海', '非遗文化出海', '海外社媒', 'AI内容剪辑'],
    },
  },
]

function createCaseJsonLd(item: (typeof cases)[number]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: item.schema.name,
    creator: { '@type': 'Organization', name: '爬爬虾' },
    about: item.schema.about,
    keywords: item.schema.keywords,
  }
}

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
            <article
              key={item.title}
              className="case-row cursor-pointer border-b border-[#E5E5E0] transition-colors duration-300 hover:bg-[#F0EFEC]"
              onMouseEnter={() => setActive(index)}
            >
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(createCaseJsonLd(item)) }} />
              <div className="grid items-start gap-4 px-2 py-8 md:grid-cols-12 md:gap-8 md:py-10">
                <div className="md:col-span-3">
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-[#737373]">{item.category}</span>
                </div>
                <div className="md:col-span-4">
                  <h3 className="p-heading">{item.title}</h3>
                </div>
                <div className="md:col-span-5">
                  <p className="p-body mb-3">{item.desc}</p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="p-chip bg-[#F7F7F5]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className={`text-sm font-semibold transition-colors ${active === index ? 'text-[#B08D57]' : 'text-[#0F1C1A]'}`}>
                    {item.result}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
