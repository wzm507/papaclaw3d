'use client'

import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Hero from '../sections/Hero'
import Agency from '../sections/Agency'
import Team from '../sections/Team'
import Projects from '../sections/Projects'
import Manifest from '../sections/Manifest'
import Expertises from '../sections/Expertises'
import Process from '../sections/Process'
import Why from '../sections/Why'
import FAQ from '../sections/FAQ'
import Footer from '../sections/Footer'
import SmoothScrollProvider from '../components/SmoothScrollProvider'

export default function PreviewPage() {
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => { setConfig(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-screen">加载预览中...</div>
  if (!config) return <div className="flex items-center justify-center h-screen">加载配置失败</div>

  return (
    <>
      {/* Preview Mode Banner */}
      <div className="fixed top-0 left-0 right-0 z-[200] bg-foudre-pink text-white text-center py-2 text-sm font-medium">
        预览模式 — 此页面显示的是未发布的修改内容
        <a href="/admin" className="ml-4 underline hover:text-white/80">返回管理后台</a>
      </div>
      <SmoothScrollProvider>
        <main className="relative" style={{ paddingTop: '36px' }}>
          <Header menuItems={config.header.menuItems} whatsappUrl={config.header.whatsappUrl} />
          <Hero title={config.hero.title} subtitle1={config.hero.subtitle1} subtitle2={config.hero.subtitle2} backgroundImage={config.hero.backgroundImage} cards={config.hero.cards} />
          <Agency leftText={config.agency.leftText} rightText={config.agency.rightText} videoUrl={config.agency.videoUrl} />
          <Team title={config.team.title} members={config.team.members} />
          <Projects title={config.projects.title} items={config.projects.items} />
          <Manifest />
          <Expertises title={config.expertises.title} subtitle={config.expertises.subtitle} items={config.expertises.items} />
          <Process title={config.process.title} subtitle={config.process.subtitle} steps={config.process.steps} />
          <Why title={config.why.title} subtitle={config.why.subtitle} reasons={config.why.reasons} />
          <FAQ title={config.faq.title} subtitle={config.faq.subtitle} items={config.faq.items} />
          <Footer contactTitle={config.footer.contactTitle} contactDescription={config.footer.contactDescription} ctaText={config.footer.ctaText} socialLinks={config.footer.socialLinks} copyright={config.footer.copyright} legalLinks={config.footer.legalLinks} credit={config.footer.credit} />
        </main>
      </SmoothScrollProvider>
    </>
  )
}
