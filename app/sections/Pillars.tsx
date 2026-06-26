'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Reveal from '../components/Reveal'
import AnimatedText from '../components/AnimatedText'

gsap.registerPlugin(ScrollTrigger)

const pillars = [
  {
    index: '01',
    title: '我们先付出，你先赚钱',
    us: '很多公司一上来就收咨询费、签年框、画 PPT。我们不中标不收费，客户没赚到钱只收工时费。先把事做成，再谈合作。',
    contrast: { them: '方案交完就结束', us: '你赚不到，我们也不多拿' },
  },
  {
    index: '02',
    title: '我们是真在海外干过，不是查资料写的',
    us: '在迪拜待了 14 年，卖过 3 栋楼，操盘过十几亿。中东、南沙、港澳三地怎么打交道，我们是真知道。',
    contrast: { them: '讲得多，落不了地', us: '自己干过，才敢接' },
  },
  {
    index: '03',
    title: '我们不只给方案，还给结果',
    us: '交了 PPT 就结束、投了广告没询盘就不管，这种模式我们不做。我们帮客户剪出过几千赞的片子，搭过 ERP，也把工厂货真正卖到中东。',
    contrast: { them: '卖服务', us: '卖战果' },
  },
]

export default function Pillars() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.pillar-row').forEach((row, index) => {
        gsap.fromTo(
          row,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
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
    <section ref={sectionRef} id="pillars" className="p-section border-t border-[#E5E5E0] bg-[#F7F7F5] py-24 md:py-32">
      <div className="p-inner">
        <div className="mb-16 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="p-kicker mb-6">Three Pillars</p>
            </Reveal>
            <AnimatedText as="h2" className="p-heading-xl">
              我们和别家，到底哪里不一样？
            </AnimatedText>
          </div>
        </div>

        <div className="border-t border-[#E5E5E0]">
          {pillars.map((pillar) => (
            <div
              key={pillar.index}
              className="pillar-row group border-b border-[#E5E5E0] py-8 transition-colors duration-500 hover:bg-[#F0EFEC] md:py-12"
            >
              <div className="grid items-start gap-6 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-1">
                  <span className="font-mono text-sm text-[#737373]">{pillar.index}</span>
                </div>
                <div className="md:col-span-4">
                  <h3 className="p-heading">{pillar.title}</h3>
                </div>
                <div className="md:col-span-4">
                  <p className="p-body">{pillar.us}</p>
                </div>
                <div className="md:col-span-3">
                  <div className="border border-[#E5E5E0] bg-white p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-[#737373]" />
                      <span className="font-mono text-[0.65rem] uppercase tracking-[0.08em] text-[#737373]">别家</span>
                    </div>
                    <p className="text-sm text-[#0F1C1A]">{pillar.contrast.them}</p>
                    <div className="my-3 h-px bg-[#E5E5E0]" />
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-[#B08D57]" />
                      <span className="font-mono text-[0.65rem] uppercase tracking-[0.08em] text-[#737373]">我们</span>
                    </div>
                    <p className="text-sm font-semibold text-[#0F1C1A]">{pillar.contrast.us}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
