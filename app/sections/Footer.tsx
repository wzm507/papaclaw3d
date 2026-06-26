'use client'

import Link from 'next/link'
import Reveal from '../components/Reveal'

interface FooterProps {
  contactTitle: string
  contactDescription: string
  ctaText: string
  socialLinks: { name: string; url: string }[]
  copyright: string
  legalLinks: { label: string; url: string }[]
  credit: string
}

export default function Footer({ contactTitle, contactDescription, ctaText, socialLinks, copyright, legalLinks, credit }: FooterProps) {
  return (
    <footer id="contact" className="p-section bg-[#0F1C1A] text-white">
      <div className="p-inner py-24 md:py-32">
        <Reveal>
          <div className="mb-20 border-b border-white/10 pb-16">
            <p className="p-kicker mb-4 text-white/40">Contact</p>
            <h2 className="p-heading-xl mb-8 max-w-4xl text-white">{contactTitle}</h2>
            <p className="p-body mb-10 max-w-2xl text-white/60">{contactDescription}</p>
            <a href="mailto:hello@papaclaw.cn" className="p-btn p-btn-light">
              {ctaText}
            </a>
          </div>
        </Reveal>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <Reveal delay={0.1}>
            <div>
              <p className="mb-4 text-lg font-semibold">Papa Claw</p>
              <p className="p-body text-white/50">{credit}</p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div>
              <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-white/40">导航</p>
              <ul className="space-y-2">
                {['首页', '我们是谁', '五大业务', '真实案例', '新闻动态', '标准问答'].map((item) => (
                  <li key={item}>
                    <a
                      href={item === '新闻动态' ? '/news' : `#${item === '首页' ? 'home' : item === '我们是谁' ? 'about' : item === '五大业务' ? 'services' : item === '真实案例' ? 'cases' : 'faq'}`}
                      className="p-link text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div>
              <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-white/40">关注我们</p>
              <ul className="space-y-2">
                {socialLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-link text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <div>
              <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-white/40">联系</p>
              <p className="text-sm text-white/60">hello@papaclaw.cn</p>
              <p className="mt-2 text-sm text-white/60">papaclaw.cn</p>
              <p className="mt-2 text-sm text-white/60">南沙跨境贸易产业集聚区</p>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center">
            <p className="text-xs text-white/30">{copyright}</p>
            <div className="flex gap-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.url}
                  className="text-xs text-white/30 transition-colors hover:text-white/60"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  )
}
