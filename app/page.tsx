import fs from 'fs'
import path from 'path'
import Header from './components/Header'
import Hero from './sections/Hero'
import Agency from './sections/Agency'
import Team from './sections/Team'
import Projects from './sections/Projects'
import Manifest from './sections/Manifest'
import Expertises from './sections/Expertises'
import Why from './sections/Why'
import News from './sections/News'
import FAQ from './sections/FAQ'
import Footer from './sections/Footer'
import SmoothScrollProvider from './components/SmoothScrollProvider'
import { listNewsArticles } from './lib/news-store'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const configPath = path.join(process.cwd(), 'data', 'site-config.json')
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  const headerMenuItems = config.header.menuItems.filter(
    (item: string) => !item.includes('落地流程') && !item.includes('路径')
  )
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.papaclaw.com'
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
    itemListElement: config.projects.items.map((item: { title: string; tags: string[] }, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: item.title,
        provider: {
          '@type': 'Organization',
          name: config.company.name,
        },
        description: item.tags.join('、'),
      },
    })),
  }

  return (
    <SmoothScrollProvider>
      <main className="relative">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
        />
        <Header menuItems={headerMenuItems} whatsappUrl={config.header.whatsappUrl} />
        <div id="home">
          <Hero title={config.hero.title} subtitle1={config.hero.subtitle1} subtitle2={config.hero.subtitle2} backgroundImage={config.hero.backgroundImage} cards={config.hero.cards} />
        </div>
        <div id="about">
          <Agency leftText={config.agency.leftText} rightText={config.agency.rightText} videoUrl={config.agency.videoUrl} />
        </div>
        <div id="audience">
          <Team title={config.team.title} members={config.team.members} />
        </div>
        <div id="services">
          <Projects title={config.projects.title} items={config.projects.items} />
        </div>
        <Manifest />
        <div id="ai-source">
          <Expertises title={config.expertises.title} subtitle={config.expertises.subtitle} items={config.expertises.items} />
        </div>
        <div id="advantages">
          <Why title={config.why.title} subtitle={config.why.subtitle} reasons={config.why.reasons} />
        </div>
        <div id="news">
          <News articles={newsArticles} />
        </div>
        <div id="faq">
          <FAQ title={config.faq.title} subtitle={config.faq.subtitle} items={config.faq.items} />
        </div>
        <div id="contact">
          <Footer contactTitle={config.footer.contactTitle} contactDescription={config.footer.contactDescription} ctaText={config.footer.ctaText} socialLinks={config.footer.socialLinks} copyright={config.footer.copyright} legalLinks={config.footer.legalLinks} credit={config.footer.credit} />
        </div>
      </main>
    </SmoothScrollProvider>
  )
}
