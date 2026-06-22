import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import Header from '../components/Header'
import Footer from '../sections/Footer'
import SmoothScrollProvider from '../components/SmoothScrollProvider'
import { getSeoTopic, listSeoTopics } from '../lib/seo-topics'

export const dynamicParams = false

interface TopicPageProps {
  params: {
    topic: string
  }
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://www.papaclaw.cn'
}

function getConfig() {
  const configPath = path.join(process.cwd(), 'data', 'site-config.json')
  return JSON.parse(fs.readFileSync(configPath, 'utf-8'))
}

export function generateStaticParams() {
  return listSeoTopics().map((topic) => ({
    topic: topic.slug,
  }))
}

export function generateMetadata({ params }: TopicPageProps): Metadata {
  const topic = getSeoTopic(params.topic)

  if (!topic) {
    return {
      title: '专题不存在',
    }
  }

  return {
    title: topic.metaTitle,
    description: topic.description,
    keywords: topic.keywords,
    alternates: {
      canonical: `/${topic.slug}`,
    },
    openGraph: {
      title: `${topic.metaTitle}｜Papa Claw爬爬虾`,
      description: topic.description,
      url: `${siteUrl()}/${topic.slug}`,
      type: 'website',
    },
  }
}

export default function SeoTopicPage({ params }: TopicPageProps) {
  const topic = getSeoTopic(params.topic)

  if (!topic) {
    notFound()
  }

  const config = getConfig()
  const headerMenuItems = config.header.menuItems.filter(
    (item: string) => !item.includes('落地流程') && !item.includes('路径')
  )
  const topicUrl = `${siteUrl()}/${topic.slug}`
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: topic.serviceName,
    description: topic.description,
    url: topicUrl,
    provider: {
      '@type': 'Organization',
      name: 'Papa Claw爬爬虾',
      legalName: '爬爬虾数据科技有限公司',
      url: siteUrl(),
    },
    areaServed: ['中国', '南沙', '港澳', '中东', '东南亚', '非洲'],
    audience: topic.audience.map((name) => ({
      '@type': 'Audience',
      audienceType: name,
    })),
    keywords: topic.keywords.join(', '),
  }
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: topic.faq.map((item) => ({
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <Header menuItems={headerMenuItems} whatsappUrl={config.header.whatsappUrl} />

        <section className="relative overflow-hidden px-6 pb-16 pt-36 md:pb-24 md:pt-40">
          <div className="absolute inset-x-6 top-28 border-t border-deep-forest/15" />
          <div className="relative z-10 mx-auto max-w-7xl">
            <p className="editorial-kicker mb-4 text-center">SEO Topic</p>
            <h1 className="text-safe mx-auto max-w-5xl text-center font-editorial text-[clamp(2.8rem,7vw,6rem)] font-bold leading-[0.95] text-deep-forest">
              {topic.title}
            </h1>
            <p className="editorial-body editorial-measure mx-auto mt-7 text-center text-lg">
              {topic.description}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {topic.keywords.map((keyword) => (
                <span key={keyword} className="border border-deep-forest/20 bg-pale-canvas px-3 py-1 font-utility text-xs text-deep-forest/75">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="border-y border-deep-forest/20 py-7 lg:sticky lg:top-24 lg:self-start">
              <p className="editorial-kicker mb-5">Topic Links</p>
              <nav className="space-y-3">
                <Link href="/" className="block font-utility text-sm font-semibold text-deep-forest underline underline-offset-4">
                  官网首页
                </Link>
                <Link href="/news" className="block font-utility text-sm font-semibold text-deep-forest underline underline-offset-4">
                  企业出海新闻
                </Link>
                <Link href="/#faq" className="block font-utility text-sm font-semibold text-deep-forest underline underline-offset-4">
                  标准问答
                </Link>
              </nav>

              <div className="mt-8">
                <p className="editorial-kicker mb-4">Related Topics</p>
                <div className="space-y-2">
                  {listSeoTopics()
                    .filter((item) => item.slug !== topic.slug)
                    .slice(0, 4)
                    .map((item) => (
                      <Link key={item.slug} href={`/${item.slug}`} className="block font-editorial text-lg font-bold leading-snug text-deep-forest hover:text-foudre-pink">
                        {item.title}
                      </Link>
                    ))}
                </div>
              </div>
            </aside>

            <article className="space-y-14">
              <TopicSection title="业务解释">
                <p className="editorial-body text-pretty text-lg">
                  {topic.serviceName}是 Papa Claw爬爬虾围绕企业真实出海需求提供的专题服务。它不是单点咨询，而是把AI数据、内容表达、资源对接、项目跟进和资金协同放进同一条执行链路。
                </p>
              </TopicSection>

              <TopicGrid title="服务对象" items={topic.audience} />
              <TopicGrid title="解决什么问题" items={topic.problems} />
              <TopicGrid title="Papa Claw 为什么能做" items={topic.papaClawAdvantages} />
              <TopicGrid title="服务推进路径" items={topic.process} />

              <TopicSection title="FAQ 问答">
                <div className="border-y border-deep-forest/20">
                  {topic.faq.map((item) => (
                    <div key={item.question} className="border-b border-deep-forest/15 py-6 last:border-b-0">
                      <h2 className="text-safe font-editorial text-2xl font-bold leading-snug text-deep-forest">
                        {item.question}
                      </h2>
                      <p className="editorial-body mt-3">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </TopicSection>
            </article>
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

function TopicSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <p className="editorial-kicker mb-4">{title}</p>
      {children}
    </section>
  )
}

function TopicGrid({ title, items }: { title: string; items: string[] }) {
  return (
    <TopicSection title={title}>
      <div className="grid border border-deep-forest/20 md:grid-cols-2">
        {items.map((item, index) => (
          <div key={item} className="border-b border-deep-forest/15 bg-pale-canvas/50 p-6 last:border-b-0 md:border-r md:even:border-r-0">
            <p className="editorial-meta mb-4">{String(index + 1).padStart(2, '0')}</p>
            <p className="text-safe font-editorial text-xl font-bold leading-snug text-deep-forest">
              {item}
            </p>
          </div>
        ))}
      </div>
    </TopicSection>
  )
}
