import type { Metadata } from 'next'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import Header from '../components/Header'
import Footer from '../sections/Footer'
import SmoothScrollProvider from '../components/SmoothScrollProvider'
import { listNewsArticles } from '../lib/news-store'
import { listSeoTopics } from '../lib/seo-topics'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '企业出海真实新闻 | Papa Claw爬爬虾',
  description:
    'Papa Claw爬爬虾官网新闻中心，抓取并整理企业出海、AI科技出海、外贸工厂获客、中东政企资源、跨境金融和海外社媒相关真实新闻。',
  alternates: {
    canonical: '/news',
  },
}

interface NewsPageProps {
  searchParams?: {
    category?: string
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date))
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const configPath = path.join(process.cwd(), 'data', 'site-config.json')
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  const headerMenuItems = config.header.menuItems.filter(
    (item: string) => !item.includes('落地流程') && !item.includes('路径')
  )
  const [articles, topics] = await Promise.all([listNewsArticles(), listSeoTopics()])
  const activeCategory = searchParams?.category || ''
  const filteredArticles = activeCategory
    ? articles.filter((article) => article.categorySlug === activeCategory)
    : articles

  return (
    <SmoothScrollProvider>
      <main className="min-h-screen bg-pale-canvas">
        <Header menuItems={headerMenuItems} whatsappUrl={config.header.whatsappUrl} />

        <section className="section pt-36">
          <div className="section-inner">
            <p className="kicker mb-4 text-center">Enterprise Global News</p>
            <h1 className="heading-lg mx-auto mb-6 max-w-4xl text-center">企业出海真实新闻</h1>
            <p className="body-text mx-auto mb-12 max-w-2xl text-center">
              这里收录公开新闻源中与企业出海相关的内容。系统只发布已抓取到全文的新闻，并按 SEO 专题整理为可检索、可引用的官网文本。
            </p>

            <div className="mb-10 flex flex-wrap justify-center gap-2">
              <Link
                href="/news"
                className={`rounded-content border px-4 py-2 font-sans text-sm font-semibold transition-all ${
                  !activeCategory
                    ? 'border-deep-forest bg-deep-forest text-paper-white'
                    : 'border-ash-whisper bg-paper-white text-deep-forest hover:border-deep-forest'
                }`}
              >
                全部
              </Link>
              {topics.map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/news?category=${topic.slug}`}
                  className={`rounded-content border px-4 py-2 font-sans text-sm font-semibold transition-all ${
                    activeCategory === topic.slug
                      ? 'border-deep-forest bg-deep-forest text-paper-white'
                      : 'border-ash-whisper bg-paper-white text-deep-forest hover:border-deep-forest'
                  }`}
                >
                  {topic.title}
                </Link>
              ))}
            </div>

            <div className="space-y-4">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}`}
                    className="group grid gap-6 card-surface p-6 transition-all duration-500 hover:-translate-y-1 hover:border-deep-forest md:grid-cols-[12rem_1fr] md:p-8"
                  >
                    <div>
                      <p className="font-mono text-xs uppercase tracking-widest text-slate-tint">{formatDate(article.publishedAt)}</p>
                      <p className="mt-3 font-sans text-xs font-semibold uppercase tracking-widest text-foudre-pink">
                        {article.categoryName}
                      </p>
                      <p className="mt-3 font-sans text-sm font-semibold text-deep-forest">{article.sourceName}</p>
                    </div>
                    <article>
                      <h2 className="font-display text-2xl font-semibold leading-tight text-deep-forest transition-colors group-hover:text-foudre-pink md:text-3xl">
                        {article.searchableTitle || article.title}
                      </h2>
                      <p className="body-text mt-4">{article.aiSummary}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {article.keywords.slice(0, 6).map((keyword: string) => (
                          <span key={keyword} className="chip">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </article>
                  </Link>
                ))
              ) : (
                <div className="card-surface p-8 text-center md:p-12">
                  <h2 className="heading text-deep-forest">新闻中心还在等第一批内容</h2>
                  <p className="body-text mx-auto mt-4 max-w-2xl">
                    点上方按钮就能触发抓取，也可以手动上传新闻全文。抓不到全文的不会发出来。
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer
          contactTitle="把出海需求推进到可落地项目"
          contactDescription="欢迎联系 Papa Claw 爬爬虾，了解 AI 科技出海、政企资源对接、全球标书商机挖掘、海外社媒运营与跨境金融服务。"
          ctaText="联系我们"
          socialLinks={config.footer.socialLinks}
          copyright={config.footer.copyright}
          legalLinks={config.footer.legalLinks}
          credit={config.footer.credit}
        />
      </main>
    </SmoothScrollProvider>
  )
}
