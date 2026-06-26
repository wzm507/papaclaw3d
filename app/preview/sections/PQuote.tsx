'use client'

import PReveal from '../components/PReveal'

export default function PQuote() {
  return (
    <section className="p-section border-t border-[#E5E5E0] bg-[#F0EFEC] py-24 md:py-32">
      <div className="p-inner">
        <PReveal>
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-10 flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-[#B08D57]" />
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[#737373]">Founder</span>
              <div className="h-px w-16 bg-[#B08D57]" />
            </div>
            <blockquote className="p-display-sm text-[#0F1C1A]">
              摊子铺大了，是在给面子打工；把摊子收小，才是给自己赚钱。
            </blockquote>
            <p className="mt-10 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-[#737373]">
              Robin · 爬爬虾创始人
            </p>
          </div>
        </PReveal>
      </div>
    </section>
  )
}
