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
    us: '别家先收咨询费、先签年框、先画 PPT。我们不中标不收费，客户不赚钱我们只收工时费。先交朋友，再谈合作。',
    contrast: { them: '方案卖完就结束', us: '你不赚钱我不赚钱' },
  },
  {
    index: '02',
    title: '我们真的懂海外，不是百度来的信息',
    us: '别家雇海归写文案、机器翻译、没出海实战经验。我们在迪拜干了 14 年，卖过 3 栋楼，操盘过十几亿，懂中东 / 南沙 / 港澳三地潜规则。',
    contrast: { them: '理论丰富，落地为零', us: '操盘过，才敢说能落地' },
  },
  {
    index: '03',
    title: '我们不只给方案，我们给你结果',
    us: '别家交了 PPT 就结束、投了广告没询盘就不管了。我们剪的片几千赞，我们帮客户搭 ERP，我们帮工厂把货卖到中东。',
    contrast: { them: '卖服务', us: '卖战果' },
  },
]

export default function Pillars() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.pillar-card').forEach((card) => {
        gsap.fromTo(
          card,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: card, start: 'top 85%', once: true },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="section bg-pale-canvas py-24 md:py-32">
      <div className="section-inner">
        <div className="mb-16 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="kicker mb-6">Three Pillars</p>
            </Reveal>
            <AnimatedText as="h2" className="heading-lg">
              我们和别家，到底哪里不一样。
            </AnimatedText>
          </div>
        </div>

        <div className="space-y-4">
          {pillars.map((pillar) => (
            <div
              key={pillar.index}
              className="pillar-card group card-surface p-6 transition-all duration-500 hover:border-deep-forest md:p-10"
            >
              <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-1">
                  <span className="font-mono text-sm text-slate-tint">{pillar.index}</span>
                </div>
                <div className="lg:col-span-4">
                  <h3 className="heading text-deep-forest">{pillar.title}</h3>
                </div>
                <div className="lg:col-span-4">
                  <p className="body-text">{pillar.us}</p>
                </div>
                <div className="lg:col-span-3">
                  <div className="rounded-content border border-ash-whisper bg-pale-canvas p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-tint" />
                      <span className="font-sans text-xs text-slate-tint">别家</span>
                    </div>
                    <p className="font-sans text-sm text-deep-forest">{pillar.contrast.them}</p>
                    <div className="my-3 h-px bg-ash-whisper" />
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-bubblegum-blush" />
                      <span className="font-sans text-xs text-slate-tint">我们</span>
                    </div>
                    <p className="font-sans text-sm font-medium text-deep-forest">{pillar.contrast.us}</p>
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
