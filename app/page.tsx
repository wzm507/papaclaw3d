import fs from 'fs'
import path from 'path'
import Header from './components/Header'
import Hero from './sections/Hero'
import About from './sections/About'
import Pillars from './sections/Pillars'
import Quote from './sections/Quote'
import Cases from './sections/Cases'
import Services from './sections/Services'
import Audiences from './sections/Audiences'
import News from './sections/News'
import FAQ from './sections/FAQ'
import Footer from './sections/Footer'
import SmoothScrollProvider from './components/SmoothScrollProvider'
import { listNewsArticles } from './lib/news-store'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const configPath = path.join(process.cwd(), 'data', 'site-config.json')
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.papaclaw.cn'
  const newsArticles = await listNewsArticles()

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.company.name,
    legalName: config.company.legalName,
    alternateName: ['Papa Claw', '爬爬虾', 'Papa Claw爬爬虾'],
    url: siteUrl,
    slogan: config.company.tagline,
    description: config.company.description,
    areaServed: ['中国', '南沙', '港澳', '中东', '东南亚', '非洲'],
    knowsAbout: [
      'AI科技出海',
      '政企资源对接',
      '跨境智库',
      '海外社媒运营',
      'AI标书代投',
      '跨境金融服务',
    ],
    sameAs: Object.values(config.company.socialLinks).filter((url) => url && url !== '#'),
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faq.items.map((item: { question: string; answer: string }) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  const servicesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Papa Claw爬爬虾五大核心业务板块',
    itemListElement: [
      'VIBE MARKETING 出海媒体',
      'CROSS-BORDER INTELLIGENCE 跨境智库',
      'STRATEGIC ADVISORY 品牌战略咨询',
      'GOVERNMENT & ENTERPRISE 政企对接',
      'FINANCIAL SERVICES 跨境金融',
    ].map((name, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name,
        provider: { '@type': 'Organization', name: config.company.name },
      },
    })),
  }

  return (
    <SmoothScrollProvider>
      <main className="relative">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }} />
        <Header menuItems={config.header.menuItems} whatsappUrl={config.header.whatsappUrl} />
        <Hero />
        <About />
        <Pillars />
        <Quote />
        <Cases />
        <Services />
        <Audiences />
        <News articles={newsArticles} />
        <FAQ title={config.faq.title} subtitle={config.faq.subtitle} items={config.faq.items} />
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
