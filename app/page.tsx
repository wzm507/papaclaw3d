import fs from 'fs'
import path from 'path'
import Header from './components/Header'
import Hero from './sections/Hero'
import Agency from './sections/Agency'
import Team from './sections/Team'
import Projects from './sections/Projects'
import Manifest from './sections/Manifest'
import Expertises from './sections/Expertises'
import Process from './sections/Process'
import Why from './sections/Why'
import FAQ from './sections/FAQ'
import Footer from './sections/Footer'
import SmoothScrollProvider from './components/SmoothScrollProvider'

export default function Home() {
  const configPath = path.join(process.cwd(), 'data', 'site-config.json')
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))

  return (
    <SmoothScrollProvider>
      <main className="relative">
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
  )
}
