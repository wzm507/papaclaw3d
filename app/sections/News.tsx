'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Section3DBackground from '../components/Section3DBackground'
import type { NewsArticle } from '../lib/news-types'

gsap.registerPlugin(ScrollTrigger)

interface NewsProps {
  articles: NewsArticle[]
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date))
}

export default function News({ articles }: NewsProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const featured = articles[0]
  const rest = articles.slice(1, 4)

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

      const cards = cardsRef.current?.querySelectorAll('.news-card')
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 82%',
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="news" ref={sectionRef} className="editorial-section bg-paper-white">
      <Section3DBackground theme="blue" />
      <div className="absolute inset-x-6 top-10 border-t border-deep-forest/15" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="editorial-kicker mb-4 text-center">Enterprise Global News</p>
        <h2 ref={titleRef} className="editorial-heading mx-auto mb-6 max-w-5xl text-center opacity-0">
          企业出海真实新闻与动态
        </h2>
        <p className="editorial-body editorial-measure mx-auto mb-14 text-center">
          新闻中心承接“凯勒斐KLF”公众号发布的真实企业出海文章，保留原文事实，并整理为搜索引擎和问答类 AI 更容易读取的官网新闻。
        </p>

        <div ref={cardsRef} className="border-y border-deep-forest/20">
          {featured ? (
            <Link
              href={`/news/${featured.slug}`}
              className="news-card grid gap-8 border-b border-deep-forest/20 bg-pale-canvas/55 p-6 opacity-0 transition-colors hover:bg-ash-whisper/70 md:grid-cols-[1.1fr_1.9fr] md:p-9"
            >
              <div className="flex flex-col justify-between gap-8">
                <div>
                  <p className="editorial-meta mb-4">{formatDate(featured.publishedAt)}</p>
                  <p className="font-utility text-sm font-semibold uppercase tracking-[0.18em] text-foudre-pink">
                    WeChat Enterprise News
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {featured.keywords.slice(0, 5).map((keyword) => (
                    <span key={keyword} className="border border-deep-forest/20 px-3 py-1 font-utility text-xs text-deep-forest/75">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-editorial text-3xl font-bold leading-tight text-deep-forest md:text-heading-lg">
                  {featured.searchableTitle || featured.title}
                </h3>
                <p className="editorial-body mt-5">
                  {featured.aiSummary}
                </p>
              </div>
            </Link>
          ) : (
            <div className="news-card bg-pale-canvas/55 p-8 text-center opacity-0">
              <h3 className="font-editorial text-heading font-bold text-deep-forest">新闻中心等待首次同步</h3>
              <p className="editorial-body mx-auto mt-4 max-w-2xl">
                完成微信公众号密钥、Vercel KV 和定时任务配置后，系统会自动同步公众号发布的企业出海新闻，并生成官网新闻详情页。
              </p>
            </div>
          )}

          {rest.length > 0 && (
            <div className="grid md:grid-cols-3">
              {rest.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="news-card border-b border-deep-forest/15 p-6 opacity-0 transition-colors hover:bg-ash-whisper/65 md:border-r md:p-7 md:last:border-r-0"
                >
                  <p className="editorial-meta mb-4">{formatDate(article.publishedAt)}</p>
                  <h3 className="font-editorial text-2xl font-bold leading-snug text-deep-forest">
                    {article.searchableTitle || article.title}
                  </h3>
                  <p className="editorial-body mt-4 line-clamp-4">
                    {article.aiSummary}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-5 border-b border-deep-forest/20 pb-8 md:flex-row">
          <p className="editorial-body max-w-3xl">
            新闻详情页会输出 Article 结构化数据、关键词和纯文本摘要，让企业出海新闻既能服务真实读者，也更容易被搜索引擎和问答类 AI 理解。
          </p>
          <Link
            href="/news"
            className="inline-flex min-h-11 items-center border border-deep-forest px-5 font-utility text-sm font-semibold text-deep-forest transition-colors hover:border-foudre-pink hover:text-foudre-pink"
          >
            查看全部新闻
          </Link>
        </div>
      </div>
    </section>
  )
}
