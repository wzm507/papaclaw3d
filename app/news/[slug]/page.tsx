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
  params: Promise<{
    slug: string
  }>
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://www.papaclaw.com'
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getNewsArticle(slug)

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
  const { slug } = await params
  const article = await getNewsArticle(slug)

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
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
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
      name: '凯勒斐KLF',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Papa Claw爬爬虾',
      url: siteUrl(),
    },
    keywords: article.keywords.join(', '),
    isBasedOn: article.sourceUrl || undefined,
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faq.map((item) => ({
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
      <main className="min-h-screen bg-paper-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <Header menuItems={headerMenuItems} whatsappUrl={config.header.whatsappUrl} />

        <article className="editorial-section pt-36">
          <div className="absolute inset-x-6 top-28 border-t border-deep-forest/15" />
          <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[15rem_1fr]">
            <aside className="space-y-8 border-y border-deep-forest/20 py-6 lg:sticky lg:top-28 lg:self-start">
              <div>
                <p className="editorial-meta mb-2">Published</p>
                <p className="font-utility text-sm font-semibold text-deep-forest">{formatDate(article.publishedAt)}</p>
              </div>
              <div>
                <p className="editorial-meta mb-3">Source</p>
                <p className="font-utility text-sm font-semibold text-deep-forest">{article.sourceName}</p>
                {article.sourceUrl && (
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex font-utility text-sm font-semibold text-foudre-pink"
                  >
                    查看公众号原文
                  </a>
                )}
              </div>
              <div>
                <p className="editorial-meta mb-3">AI Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {article.keywords.map((keyword) => (
                    <span key={keyword} className="border border-deep-forest/20 px-3 py-1 font-utility text-xs text-deep-forest/75">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                href="/news"
                className="inline-flex min-h-11 items-center border border-deep-forest px-4 font-utility text-sm font-semibold text-deep-forest transition-colors hover:border-foudre-pink hover:text-foudre-pink"
              >
                返回新闻列表
              </Link>
            </aside>

            <div className="max-w-4xl">
              <p className="editorial-kicker mb-4">Papa Claw News</p>
              <h1 className="font-editorial text-[clamp(2.5rem,8vw,5.75rem)] font-bold leading-[0.94] text-deep-forest">
                {article.searchableTitle || article.title}
              </h1>
              <p className="editorial-body mt-8 border-y border-deep-forest/20 py-6 text-xl leading-relaxed">
                {article.aiSummary}
              </p>

              <section className="mt-12 space-y-6">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="font-editorial text-xl leading-relaxed text-deep-forest md:text-2xl">
                    {paragraph}
                  </p>
                ))}
              </section>

              {article.faq.length > 0 && (
                <section className="mt-16 border-y border-deep-forest/20 py-8">
                  <p className="editorial-kicker mb-6">AI Ready Q&A</p>
                  <div className="space-y-7">
                    {article.faq.map((item) => (
                      <div key={item.question}>
                        <h2 className="font-editorial text-2xl font-bold leading-snug text-deep-forest">
                          {item.question}
                        </h2>
                        <p className="editorial-body mt-3">
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </article>

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

export async function generateStaticParams() {
  const articles = await listNewsArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}
