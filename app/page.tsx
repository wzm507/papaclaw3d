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
import CursorSpotlight from './components/CursorSpotlight'
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
      <CursorSpotlight />
      <main className="relative">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }} />
        <Header menuItems={config.header.menuItems} whatsappUrl={config.header.whatsappUrl} />
        <Hero
          title="我们不靠赚方案的钱活着。"
          subtitle1="我们靠你赚到钱活着。"
          subtitle2="先付出，先交朋友，用成本价帮你出海。你不赚钱，我们只收工时费。"
          backgroundImage={config.hero.backgroundImage}
          cards={config.hero.cards}
        />
        <About
          leftText="爬爬虾不是一家从零开始的公司。我们是把 14 年海外踩过的坑、赚过的钱、认识过的人，全部打包带回了南沙。"
          rightText="别人出海是摸着石头过河。我们是开着直升机过河。我们不租大办公室，不堆人，不撑排场。我们在南沙政府补贴的共享办公室里开会，把省下来的钱全砸在业务上。"
        />
        <Pillars />
        <Quote />
        <Cases />
        <Services />
        <Audiences />
        <News articles={newsArticles} />
        <FAQ title={config.faq.title} subtitle={config.faq.subtitle} items={config.faq.items} />
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
