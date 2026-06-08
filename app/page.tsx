'use client'

import { useEffect } from 'react'
import { useSmoothScroll } from './hooks/useSmoothScroll'
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

export default function Home() {
  useSmoothScroll()

  return (
    <main className="relative">
      <Header />
      <Hero />
      <Agency />
      <Team />
      <Projects />
      <Manifest />
      <Expertises />
      <Process />
      <Why />
      <FAQ />
      <Footer />
    </main>
  )
}
