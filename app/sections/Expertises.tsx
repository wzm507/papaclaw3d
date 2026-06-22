'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Section3DBackground from '../components/Section3DBackground'

gsap.registerPlugin(ScrollTrigger)

interface ExpertisesProps {
  title: string
  subtitle: string
  items: { icon: string; title: string; description: string }[]
}

const strengthItems = [
  {
    icon: '01',
    title: '政企资源能落地',
    description: '深耕南沙、港澳与中东政企渠道，围绕政策申报、商务拜会、园区落地和项目对接提供可执行路径。',
  },
  {
    icon: '02',
    title: 'AI数据做托底',
    description: '用AI筛选海外标讯、采购需求、市场信息和内容反馈，让企业出海判断有数据依据。',
  },
  {
    icon: '03',
    title: '五大业务成闭环',
    description: '出海媒体、跨境智库、品牌战略咨询、政企对接、跨境金融协同推进，不只停留在方案层。',
  },
  {
    icon: '04',
    title: '交付边界清楚',
    description: '不承诺百分百中标或保证订单，强调资源赋能、务实落地和提升成交概率。',
  },
]

export default function Expertises(_props: ExpertisesProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => {
      mm.add('(min-width: 768px)', () => {
        const cards = cardsRef.current?.querySelectorAll('.expertise-card') || []
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=150%',
            pin: stickyRef.current,
            scrub: 0.5,
            pinSpacing: true,
          },
        })

        tl.fromTo(
          titleRef.current,
          { y: 70, opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out' },
          0
        )

        tl.fromTo(
          cards,
          { y: 90, opacity: 0, rotateX: 8 },
          { y: 0, opacity: 1, rotateX: 0, stagger: 0.08, ease: 'power2.out' },
          0.12
        )

        tl.to([titleRef.current, cardsRef.current], { y: -18, ease: 'none' }, 0.78)
      })

      mm.add('(max-width: 767px)', () => {
        gsap.fromTo(
          titleRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            },
          }
        )

        const cards = cardsRef.current?.querySelectorAll('.expertise-card')
        if (cards) {
          gsap.fromTo(
            cards,
            { y: 45, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.08,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 82%',
              },
            }
          )
        }
      })

    }, sectionRef)

    return () => {
      mm.revert()
      ctx.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative w-full bg-pale-canvas md:h-[250vh]">
      <div ref={stickyRef} className="relative min-h-dvh overflow-hidden px-6 py-24 md:flex md:h-dvh md:items-center md:py-20">
        <Section3DBackground theme="pink" />
        <div className="absolute inset-x-6 top-10 border-t border-deep-forest/15" />

        <div className="relative z-20 mx-auto grid w-full max-w-7xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <p className="editorial-kicker mb-4 text-center md:text-left">Company Strength</p>
            <h2 ref={titleRef} className="text-safe mx-auto max-w-[12ch] text-center font-editorial text-[clamp(2.35rem,5vw,4.6rem)] font-bold leading-[1.02] text-deep-forest opacity-0 md:mx-0 md:text-left">
              Papa Claw爬爬虾的真实落地能力
            </h2>
            <p className="editorial-body text-pretty mx-auto mt-6 max-w-xl text-center md:mx-0 md:text-left">
              我们不是只交付方案的咨询公司，而是围绕AI数据、政企资源、品牌内容、项目对接和资金服务，把出海动作推进到可执行阶段。
            </p>
          </div>

          <div ref={cardsRef} className="grid grid-cols-1 gap-px overflow-hidden rounded-content border border-deep-forest/20 bg-deep-forest/20 shadow-[0_24px_70px_rgba(17,17,15,0.12)] sm:grid-cols-2">
            {strengthItems.map((expertise) => (
              <div
                key={expertise.icon}
                className="expertise-card relative overflow-hidden bg-paper-white/90 p-5 opacity-0 md:p-7"
              >
                <div className="editorial-meta relative z-10 mb-5">
                  {expertise.icon}
                </div>
                <h3 className="text-safe relative z-10 mb-3 font-editorial text-[clamp(1.4rem,2.2vw,2rem)] font-bold leading-tight text-deep-forest">
                  {expertise.title}
                </h3>
                <p className="editorial-body text-pretty relative z-10">
                  {expertise.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
