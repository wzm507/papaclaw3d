'use client'

import Link from 'next/link'
import PReveal from '../components/PReveal'
import PAnimatedText from '../components/PAnimatedText'

interface NewsArticle {
  slug: string
  title: string
  searchableTitle?: string
  categoryName?: string
  sourceName?: string
  aiSummary?: string
  publishDate?: string
}

interface PNewsProps {
  articles: NewsArticle[]
}

export default function PNews({ articles }: PNewsProps) {
  const displayArticles = articles.slice(0, 4)

  return (
    <section id="news" className="p-section border-t border-[#E5E5E0] bg-[#F7F7F5] py-24 md:py-32">
      <div className="p-inner">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="md:max-w-xl">
            <PReveal>
              <p className="p-kicker mb-6">Enterprise Global News</p>
            </PReveal>
            <PAnimatedText as="h2" className="p-heading-xl">
              出海新闻与动态
            </PAnimatedText>
          </div>
          <PReveal delay={0.2}>
            <Link href="/news" className="p-btn-ghost">查看全部新闻 →</Link>
          </PReveal>
        </div>

        {displayArticles.length === 0 ? (
          <PReveal>
            <div className="border border-[#E5E5E0] bg-white p-8 md:p-12">
              <p className="p-heading mb-2">新闻中心正在准备第一批内容</p>
              <p className="p-body">后台已经接好公开新闻源抓取，也支持手动上传。配置好定时任务后，系统会每天自动更新。</p>
            </div>
          </PReveal>
        ) : (
          <div className="grid gap-px border-t border-[#E5E5E0] bg-[#E5E5E0] md:grid-cols-2">
            {displayArticles.map((article) => (
              <PReveal key={article.slug}>
                <Link href={`/news/${article.slug}`} className="group block h-full border-b border-[#E5E5E0] bg-[#F7F7F5] p-6 transition-colors duration-500 hover:bg-[#F0EFEC] md:p-8">
                  <div className="mb-4 flex items-center gap-3">
                    {article.categoryName && <span className="p-chip">{article.categoryName}</span>}
                    {article.sourceName && <span className="font-mono text-[0.65rem] uppercase tracking-[0.08em] text-[#737373]">{article.sourceName}</span>}
                  </div>
                  <h3 className="p-heading mb-3 transition-colors group-hover:text-[#B08D57]">{article.searchableTitle || article.title}</h3>
                  {article.aiSummary && <p className="p-body line-clamp-2">{article.aiSummary}</p>}
                </Link>
              </PReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
