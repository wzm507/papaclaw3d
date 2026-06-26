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
      <main className="min-h-screen bg-[#F7F7F5]">
        <Header menuItems={headerMenuItems} whatsappUrl={config.header.whatsappUrl} />

        <section className="p-section pt-36">
          <div className="p-inner">
            <p className="p-kicker mb-4 text-center">Enterprise Global News</p>
            <h1 className="p-heading-xl mx-auto mb-6 max-w-4xl text-center">企业出海真实新闻</h1>
            <p className="p-body-lg mx-auto mb-12 max-w-2xl text-center">
              这里收录公开新闻源中与企业出海相关的内容。系统只发布已抓取到全文的新闻，并按 SEO 专题整理为可检索、可引用的官网文本。
            </p>

            <div className="mb-10 flex flex-wrap justify-center gap-2">
              <Link
                href="/news"
                className={`border px-4 py-2 text-sm font-semibold transition-all ${
                  !activeCategory
                    ? 'border-[#0F1C1A] bg-[#0F1C1A] text-white'
                    : 'border-[#E5E5E0] bg-white text-[#0F1C1A] hover:border-[#0F1C1A]'
                }`}
              >
                全部
              </Link>
              {topics.map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/news?category=${topic.slug}`}
                  className={`border px-4 py-2 text-sm font-semibold transition-all ${
                    activeCategory === topic.slug
                      ? 'border-[#0F1C1A] bg-[#0F1C1A] text-white'
                      : 'border-[#E5E5E0] bg-white text-[#0F1C1A] hover:border-[#0F1C1A]'
                  }`}
                >
                  {topic.title}
                </Link>
              ))}
            </div>

            <div className="border-t border-[#E5E5E0]">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}`}
                    className="group block border-b border-[#E5E5E0] bg-white p-6 transition-all duration-500 hover:bg-[#F0EFEC] md:p-8"
                  >
                    <div className="grid gap-6 md:grid-cols-[12rem_1fr]">
                      <div>
                        <p className="font-mono text-xs uppercase tracking-widest text-[#737373]">{formatDate(article.publishedAt)}</p>
                        <p className="mt-3 font-mono text-xs font-semibold uppercase tracking-widest text-[#B08D57]">
                          {article.categoryName}
                        </p>
                        <p className="mt-3 text-sm font-semibold text-[#0F1C1A]">{article.sourceName}</p>
                      </div>
                      <article>
                        <h2 className="p-heading text-2xl transition-colors group-hover:text-[#B08D57] md:text-3xl">
                          {article.searchableTitle || article.title}
                        </h2>
                        <p className="p-body mt-4">{article.aiSummary}</p>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {article.keywords.slice(0, 6).map((keyword: string) => (
                            <span key={keyword} className="p-chip">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </article>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="border-b border-[#E5E5E0] bg-white p-8 text-center md:p-12">
                  <h2 className="p-heading text-[#0F1C1A]">新闻中心还在等第一批内容</h2>
                  <p className="p-body mx-auto mt-4 max-w-2xl">
                    点上方按钮就能触发抓取，也可以手动上传新闻全文。抓不到全文的不会发出来。
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer
          contactTitle={config.footer.contactTitle}
          contactDescription={config.footer.contactDescription}
          ctaText={config.footer.ctaText}
          socialLinks={config.footer.socialLinks}
          copyright={config.footer.copyright}
          legalLinks={config.footer.legalLinks}
          credit={config.footer.credit}
        />
      </main>
    </SmoothScrollProvider>
  )
}
