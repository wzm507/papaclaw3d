'use client'

import Reveal from '../components/Reveal'

export default function Quote() {
  return (
    <section className="section bg-pale-canvas py-24 md:py-32">
      <div className="section-inner">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <svg className="mx-auto mb-8 h-10 w-10 text-foudre-pink/30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <blockquote className="font-display text-display-sm font-semibold text-deep-forest">
              摊子铺大了，你是在给面子打工。把摊子收小，才能给自己赚钱。
            </blockquote>
            <p className="mt-8 font-sans text-sm uppercase tracking-widest text-slate-tint">Robin · 爬爬虾创始人</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
