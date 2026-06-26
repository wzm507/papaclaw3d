import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import Header from '../../components/Header'
import Footer from '../../sections/Footer'
import SmoothScrollProvider from '../../components/SmoothScrollProvider'
import { getNewsArticle, listNewsArticles } from '../../lib/news-store'

export const dynamic = 'force-dynamic'

interface NewsDetailPageProps {
  params: {
    slug: string
  }
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.papaclaw.cn').replace(/\/$/, '')
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const article = await getNewsArticle(params.slug)

  if (!article) {
    return {
      title: '新闻不存在 | Papa Claw爬爬虾',
    }
  }

  return {
    title: `${article.searchableTitle || article.title} | Papa Claw爬爬虾新闻`,
    description: article.aiSummary,
    keywords: article.keywords,
    alternates: {
      canonical: `/news/${article.slug}`,
    },
    openGraph: {
      title: article.searchableTitle || article.title,
      description: article.aiSummary,
      url: `${siteUrl()}/news/${article.slug}`,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
  }
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const article = await getNewsArticle(params.slug)

  if (!article) {
    notFound()
  }

  const configPath = path.join(process.cwd(), 'data', 'site-config.json')
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  const headerMenuItems = config.header.menuItems.filter(
    (item: string) => !item.includes('落地流程') && !item.includes('路径')
  )
  const articleUrl = `${siteUrl()}/news/${article.slug}`
  const paragraphs = article.contentText
    .split(/\n{2,}|\n/)
    .map((paragraph: string) => paragraph.trim())
    .filter(Boolean)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.searchableTitle || article.title,
    description: article.aiSummary,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: articleUrl,
    author: {
      '@type': 'Organization',
      name: article.sourceName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Papa Claw爬爬虾',
      url: siteUrl(),
    },
    articleSection: article.categoryName,
    keywords: article.keywords.join(', '),
    isBasedOn: article.originalUrl || article.sourceUrl || undefined,
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faq.map((item: { question: string; answer: string }) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <SmoothScrollProvider>
      <main className="min-h-screen bg-pale-canvas">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <Header menuItems={headerMenuItems} whatsappUrl={config.header.whatsappUrl} />

        <article className="section pt-36">
          <div className="section-inner">
            <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[16rem_1fr]">
              <aside className="space-y-8 card-surface p-6 lg:sticky lg:top-28 lg:self-start">
                <div>
                  <p className="kicker mb-2">Published</p>
                  <p className="font-sans text-sm font-semibold text-deep-forest">{formatDate(article.publishedAt)}</p>
                </div>
                <div>
                  <p className="kicker mb-3">Category</p>
                  <Link href={`/news?category=${article.categorySlug}`} className="font-sans text-sm font-semibold text-foudre-pink">
                    {article.categoryName}
                  </Link>
                </div>
                <div>
                  <p className="kicker mb-3">Source</p>
                  <p className="font-sans text-sm font-semibold text-deep-forest">{article.sourceName}</p>
                  {(article.originalUrl || article.sourceUrl) && (
                    <a
                      href={article.originalUrl || article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex font-sans text-sm font-semibold text-foudre-pink"
                    >
                      查看原文来源 →
                    </a>
                  )}
                </div>
                <div>
                  <p className="kicker mb-3">Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {article.keywords.map((keyword: string) => (
                      <span key={keyword} className="chip">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <Link href="/news" className="btn-secondary w-full">
                  返回新闻列表
                </Link>
              </aside>

              <div className="max-w-4xl">
                <p className="kicker mb-4">Papa Claw News</p>
                <h1 className="font-display text-[clamp(2rem,5vw,4rem)] font-semibold leading-[1.05] text-deep-forest">
                  {article.searchableTitle || article.title}
                </h1>
                <p className="body-text mt-8 card-surface p-6 text-lg leading-relaxed md:text-xl">
                  {article.aiSummary}
                </p>

                <section className="mt-12 space-y-6">
                  {paragraphs.map((paragraph: string, index: number) => (
                    <p key={index} className="font-sans text-lg leading-relaxed text-deep-forest md:text-xl">
                      {paragraph}
                    </p>
                  ))}
                </section>

                {article.faq.length > 0 && (
                  <section className="mt-16 card-surface p-7">
                    <p className="kicker mb-6">Q&A</p>
                    <div className="space-y-7">
                      {article.faq.map((item: { question: string; answer: string }) => (
                        <div key={item.question}>
                          <h2 className="font-display text-xl font-semibold leading-snug text-deep-forest md:text-2xl">
                            {item.question}
                          </h2>
                          <p className="body-text mt-3">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        </article>

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

export async function generateStaticParams() {
  const articles = await listNewsArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}
