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
import BreadcrumbJsonLd from './components/BreadcrumbJsonLd'
import { listNewsArticles } from './lib/news-store'
import { getSiteConfig } from './lib/site-config-store'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const config = await getSiteConfig() as any
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.papaclaw.cn'
  const newsArticles = await listNewsArticles()

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '爬爬虾',
    alternateName: 'Papa Claw',
    url: 'https://www.papaclaw.cn',
    logo: 'https://www.papaclaw.cn/assets/papa-claw-logo.png',
    description:
      '做出海的AI获客引擎。用AI批量生产本土化内容、运营多平台账号矩阵、做AI搜索占位(GEO)，帮出海企业获取海外客户。',
    foundingLocation: '广州南沙',
    slogan: '做出海的AI获客引擎，自己干过3亿成交',
    founder: {
      '@type': 'Person',
      name: 'Robin',
      jobTitle: '创始人',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Chinese', 'English'],
    },
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Papa Claw 爬爬虾',
    url: 'https://www.papaclaw.cn',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.papaclaw.cn/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
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
    name: 'Papa Claw爬爬虾1+4服务体系',
    itemListElement: [
      'AI出海获客引擎',
      '跨境智库',
      '品牌战略咨询',
      '政企对接',
      '跨境金融',
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
        <BreadcrumbJsonLd items={[{ name: '首页', url: siteUrl }]} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
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
