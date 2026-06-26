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

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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

export async function generateStaticParams() {
  const topics = await listSeoTopics()
  return topics.map((topic) => ({
    topic: topic.slug,
  }))
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const topic = await getSeoTopic(params.topic)

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

export default async function SeoTopicPage({ params }: TopicPageProps) {
  const topic = await getSeoTopic(params.topic)

  if (!topic) {
    notFound()
  }

  const config = getConfig()
  const relatedTopics = await listSeoTopics()
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
    audience: topic.audience.map((name: string) => ({
      '@type': 'Audience',
      audienceType: name,
    })),
    keywords: topic.keywords.join(', '),
  }
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: topic.faq.map((item: { question: string; answer: string }) => ({
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <Header menuItems={headerMenuItems} whatsappUrl={config.header.whatsappUrl} />

        <section className="section overflow-hidden pt-36 md:pt-40">
          <div className="section-inner text-center">
            <p className="kicker mb-4">SEO Topic</p>
            <h1 className="heading-lg mx-auto max-w-4xl">{topic.title}</h1>
            <p className="body-text mx-auto mt-6 max-w-2xl text-lg">{topic.description}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {topic.keywords.map((keyword: string) => (
                <span key={keyword} className="chip">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="section pb-24">
          <div className="section-inner">
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <aside className="card-surface p-6 lg:sticky lg:top-24 lg:self-start">
                <p className="kicker mb-5">Topic Links</p>
                <nav className="space-y-3">
                  <Link href="/" className="link-underline block font-sans text-sm font-semibold text-deep-forest">
                    官网首页
                  </Link>
                  <Link href="/news" className="link-underline block font-sans text-sm font-semibold text-deep-forest">
                    企业出海新闻
                  </Link>
                  <Link href="/#faq" className="link-underline block font-sans text-sm font-semibold text-deep-forest">
                    标准问答
                  </Link>
                </nav>

                <div className="mt-8">
                  <p className="kicker mb-4">Related Topics</p>
                  <div className="space-y-2">
                    {relatedTopics
                      .filter((item) => item.slug !== topic.slug)
                      .slice(0, 4)
                      .map((item) => (
                        <Link key={item.slug} href={`/${item.slug}`} className="link-underline block font-sans text-lg font-semibold text-deep-forest">
                          {item.title}
                        </Link>
                      ))}
                  </div>
                </div>
              </aside>

              <article className="space-y-14">
                <TopicSection title="业务解释">
                  <p className="body-text text-pretty text-lg">
                    {topic.serviceName}是我们围绕真实出海需求做的专题服务。不是只给一份咨询，而是把 AI 数据、内容表达、资源对接、项目跟进和资金协同串成一条可执行的链路。
                  </p>
                </TopicSection>

                <TopicGrid title="服务对象" items={topic.audience} />
                <TopicGrid title="解决什么问题" items={topic.problems} />
                <TopicGrid title="Papa Claw 为什么能做" items={topic.papaClawAdvantages} />
                <TopicGrid title="服务推进路径" items={topic.process} />

                <TopicSection title="FAQ 问答">
                  <div className="border-y border-ash-whisper">
                    {topic.faq.map((item: { question: string; answer: string }) => (
                      <div key={item.question} className="border-b border-ash-whisper py-6 last:border-b-0">
                        <h2 className="font-display text-xl font-semibold leading-snug text-deep-forest md:text-2xl">
                          {item.question}
                        </h2>
                        <p className="body-text mt-3">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </TopicSection>
              </article>
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

function TopicSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <p className="kicker mb-4">{title}</p>
      {children}
    </section>
  )
}

function TopicGrid({ title, items }: { title: string; items: string[] }) {
  return (
    <TopicSection title={title}>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item, index) => (
          <div key={item} className="card-surface p-6 transition-colors hover:bg-warm-gray">
            <p className="kicker mb-4">{String(index + 1).padStart(2, '0')}</p>
            <p className="font-display text-lg font-semibold leading-snug text-deep-forest">{item}</p>
          </div>
        ))}
      </div>
    </TopicSection>
  )
}
