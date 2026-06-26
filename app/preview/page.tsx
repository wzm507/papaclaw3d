'use client'

import { useEffect, useState } from 'react'
import PHeader from './components/PHeader'
import PHero from './sections/PHero'
import PAbout from './sections/PAbout'
import PPillars from './sections/PPillars'
import PQuote from './sections/PQuote'
import PCases from './sections/PCases'
import PServices from './sections/PServices'
import PAudiences from './sections/PAudiences'
import PNews from './sections/PNews'
import PFAQ from './sections/PFAQ'
import PFooter from './sections/PFooter'

interface NewsArticle {
  slug: string
  title: string
  searchableTitle?: string
  categoryName?: string
  sourceName?: string
  aiSummary?: string
  publishDate?: string
}

export default function PreviewPage() {
  const [config, setConfig] = useState<any>(null)
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/config').then((res) => res.json()),
      fetch('/api/news').then((res) => res.json()),
    ])
      .then(([configData, newsData]) => {
        setConfig(configData)
        setArticles(newsData.data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F7F7F5] font-sans text-sm text-[#737373]">
        加载预览中...
      </div>
    )
  }

  if (!config) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F7F7F5] font-sans text-sm text-red-600">
        加载配置失败
      </div>
    )
  }

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[200] bg-[#B08D57] py-2 text-center font-sans text-xs font-semibold text-white">
        新版预览模式 — 瑞士编辑极简风格
        <a href="/admin" className="ml-4 underline hover:text-white/80">
          返回管理后台
        </a>
      </div>
      <main className="relative" style={{ paddingTop: '32px' }}>
        <PHeader menuItems={config.header.menuItems} />
        <PHero />
        <PAbout />
        <PPillars />
        <PQuote />
        <PCases />
        <PServices />
        <PAudiences />
        <PNews articles={articles} />
        <PFAQ title={config.faq.title} subtitle={config.faq.subtitle} items={config.faq.items} />
        <PFooter
          contactTitle={config.footer.contactTitle}
          contactDescription={config.footer.contactDescription}
          ctaText={config.footer.ctaText}
          socialLinks={config.footer.socialLinks}
          copyright={config.footer.copyright}
          legalLinks={config.footer.legalLinks}
          credit={config.footer.credit}
        />
      </main>
    </>
  )
}
