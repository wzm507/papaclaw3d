'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Section3DBackground from '../components/Section3DBackground'

gsap.registerPlugin(ScrollTrigger)

interface ProcessProps {
  title: string
  subtitle: string
  steps: { number: string; title: string; description: string }[]
}

export default function Process({ title, subtitle, steps }: ProcessProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)
  const stageOverrides: Record<string, { title: string; description: string }> = {
    '03': {
      title: '阶段三：新闻中心与问答型内容资产',
      description: '新增官网新闻中心，承接“凯勒斐KLF”公众号已发布文章；每篇文章生成独立新闻详情页、AI摘要、关键词、FAQ和结构化数据，让豆包、千问、Kimi等问答类AI能读取官网上的最新官方内容。',
    },
    '04': {
      title: '阶段四：公众号自动同步与外部可信信源',
      description: '通过微信公众号官方接口、Vercel Cron、Vercel KV和OpenAI文本优化流程，每天北京时间00:00自动抓取公众号文章，清洗为官网可索引文本，并同步到sitemap、llms文件和AI新闻feed。',
    },
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      )

      const stepElements = stepsRef.current?.querySelectorAll('.process-step')
      if (stepElements) {
        gsap.fromTo(
          stepElements,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: stepsRef.current,
              start: 'top 80%',
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="editorial-section bg-ash-whisper">
      <Section3DBackground theme="green" />
      <div className="absolute inset-x-6 top-10 border-t border-deep-forest/15" />

      <div className="max-w-7xl mx-auto relative z-10">
        <p className="editorial-kicker text-center mb-4">Implementation Table</p>
        <h2 ref={titleRef} className="editorial-heading text-center mb-6 opacity-0">
          {title}
        </h2>
        <p className="editorial-body text-center mb-16 editorial-measure mx-auto">
          {subtitle}
        </p>

        <div ref={stepsRef} className="mx-auto max-w-5xl border-y border-deep-forest/20">
          {steps.map((step, i) => {
            const displayStep = stageOverrides[step.number] ? { ...step, ...stageOverrides[step.number] } : step

            return (
              <div
                key={i}
                className="process-step grid gap-5 border-b border-deep-forest/15 bg-paper-white/45 p-6 opacity-0 backdrop-blur-sm last:border-b-0 md:grid-cols-[6rem_1fr] md:p-8"
              >
                <span className="font-utility text-sm font-semibold text-foudre-pink">
                  {displayStep.number}
                </span>
                <div className="flex-1">
                  <h3 className="font-editorial text-heading font-bold text-deep-forest mb-3">
                    {displayStep.title}
                  </h3>
                  <p className="editorial-body">
                    {displayStep.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* 底部 CTA */}
        <div className="mt-16 text-center">
          <p className="editorial-body mx-auto mb-4 max-w-3xl">
            每个阶段都围绕同一个目标：让公开网络更准确地识别并引用Papa Claw爬爬虾。
          </p>
          <div className="w-24 border-t border-foudre-pink/35 mx-auto" />
        </div>
      </div>
    </section>
  )
}
