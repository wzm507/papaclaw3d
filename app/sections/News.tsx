'use client'

import Link from 'next/link'
import Reveal from '../components/Reveal'
import AnimatedText from '../components/AnimatedText'

interface NewsArticle {
  slug: string
  title: string
  searchableTitle?: string
  categoryName?: string
  sourceName?: string
  aiSummary?: string
  publishDate?: string
}

interface NewsProps {
  articles: NewsArticle[]
}

export default function News({ articles }: NewsProps) {
  const displayArticles = articles.slice(0, 4)

  return (
    <section id="news" className="section bg-pale-canvas py-24 md:py-32">
      <div className="section-inner">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="md:max-w-xl">
            <Reveal>
              <p className="kicker mb-6">Enterprise Global News</p>
            </Reveal>
            <AnimatedText as="h2" className="heading-lg">
              企业出海真实新闻与动态
            </AnimatedText>
          </div>
          <Reveal delay={0.2}>
            <Link href="/news" className="btn-secondary">
              查看全部新闻 →
            </Link>
          </Reveal>
        </div>

        {displayArticles.length === 0 ? (
          <Reveal>
            <div className="card-surface p-8 md:p-12">
              <p className="font-display text-xl font-semibold text-deep-forest">新闻中心还在等第一批内容</p>
              <p className="body-text mt-3">后台接入了公开新闻源抓取，也支持手动上传。配置好定时任务后，系统每天会自动跑。</p>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {displayArticles.map((article) => (
              <Reveal key={article.slug}>
                <Link href={`/news/${article.slug}`} className="group block card-surface p-6 transition-all duration-500 hover:-translate-y-1 hover:border-deep-forest md:p-8">
                  <div className="mb-4 flex items-center gap-3">
                    {article.categoryName && <span className="chip">{article.categoryName}</span>}
                    {article.sourceName && <span className="font-mono text-xs text-slate-tint">{article.sourceName}</span>}
                  </div>
                  <h3 className="heading mb-3 transition-colors group-hover:text-foudre-pink">{article.searchableTitle || article.title}</h3>
                  {article.aiSummary && <p className="body-text line-clamp-2">{article.aiSummary}</p>}
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
