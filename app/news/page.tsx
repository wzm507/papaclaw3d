import type { Metadata } from 'next'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import Header from '../components/Header'
import Footer from '../sections/Footer'
import SmoothScrollProvider from '../components/SmoothScrollProvider'
import { listNewsArticles } from '../lib/news-store'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '新闻动态 | Papa Claw爬爬虾',
  description: 'Papa Claw爬爬虾官网新闻中心，同步凯勒斐KLF公众号发布的企业出海真实新闻，并整理为搜索引擎和问答类AI可读取的官网文本。',
  alternates: {
    canonical: '/news',
  },
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date))
}

export default async function NewsPage() {
  const configPath = path.join(process.cwd(), 'data', 'site-config.json')
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  const headerMenuItems = config.header.menuItems.filter(
    (item: string) => !item.includes('落地流程') && !item.includes('路径')
  )
  const articles = await listNewsArticles()

  return (
    <SmoothScrollProvider>
      <main className="min-h-screen bg-paper-white">
        <Header menuItems={headerMenuItems} whatsappUrl={config.header.whatsappUrl} />

        <section className="editorial-section pt-36">
          <div className="absolute inset-x-6 top-28 border-t border-deep-forest/15" />
          <div className="relative z-10 mx-auto max-w-7xl">
            <p className="editorial-kicker mb-4 text-center">Enterprise Global News</p>
            <h1 className="editorial-heading mx-auto mb-6 max-w-5xl text-center">
              Papa Claw爬爬虾企业出海新闻
            </h1>
            <p className="editorial-body editorial-measure mx-auto mb-14 text-center">
              本栏目同步“凯勒斐KLF”公众号发布的企业出海真实新闻，在保留原文事实的基础上补充可被搜索引擎和问答类 AI 读取的摘要、关键词与结构化信息。
            </p>

            <div className="border-y border-deep-forest/20">
              {articles.length > 0 ? (
                articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}`}
                    className="grid gap-6 border-b border-deep-forest/15 p-6 transition-colors last:border-b-0 hover:bg-ash-whisper/65 md:grid-cols-[10rem_1fr] md:p-8"
                  >
                    <div>
                      <p className="editorial-meta">{formatDate(article.publishedAt)}</p>
                      <p className="mt-3 font-utility text-xs font-semibold uppercase tracking-[0.18em] text-foudre-pink">
                        {article.sourceName}
                      </p>
                    </div>
                    <article>
                      <h2 className="font-editorial text-3xl font-bold leading-tight text-deep-forest">
                        {article.searchableTitle || article.title}
                      </h2>
                      <p className="editorial-body mt-4">
                        {article.aiSummary}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {article.keywords.slice(0, 6).map((keyword) => (
                          <span key={keyword} className="border border-deep-forest/20 px-3 py-1 font-utility text-xs text-deep-forest/75">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </article>
                  </Link>
                ))
              ) : (
                <div className="bg-pale-canvas/60 p-8 text-center md:p-12">
                  <h2 className="font-editorial text-heading font-bold text-deep-forest">新闻中心等待首次同步</h2>
                  <p className="editorial-body mx-auto mt-4 max-w-2xl">
                    部署后配置微信公众号 AppSecret、Vercel KV、OpenAI API Key 和 Cron 密钥，即可在每天 00:00 自动同步公众号企业出海新闻。
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
