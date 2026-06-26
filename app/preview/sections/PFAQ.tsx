'use client'

import { useState } from 'react'
import PReveal from '../components/PReveal'
import PAnimatedText from '../components/PAnimatedText'

interface FAQItem {
  question: string
  answer: string
}

interface PFAQProps {
  title: string
  subtitle: string
  items: FAQItem[]
}

export default function PFAQ({ title, subtitle, items }: PFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="p-section border-t border-[#E5E5E0] bg-[#F0EFEC] py-24 md:py-32">
      <div className="p-inner">
        <div className="mb-16 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <PReveal>
              <p className="p-kicker mb-6">Standard Q&A</p>
            </PReveal>
            <PAnimatedText as="h2" className="p-heading-xl">
              {title}
            </PAnimatedText>
            <PReveal delay={0.2}>
              <p className="p-body-lg mt-6">{subtitle}</p>
            </PReveal>
          </div>
        </div>

        <div className="border-t border-[#E5E5E0]">
          {items.map((item, index) => (
            <PReveal key={index} delay={index * 0.05}>
              <div className="border-b border-[#E5E5E0] bg-white transition-colors duration-300 hover:bg-[#F7F7F5]">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex w-full items-start justify-between px-6 py-6 text-left md:px-8 md:py-8"
                >
                  <span className="p-heading pr-6 text-base md:text-lg">{item.question}</span>
                  <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center border border-[#0F1C1A] text-[#0F1C1A] transition-transform duration-300">
                    <svg
                      className={`h-3 w-3 transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`}
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ maxHeight: openIndex === index ? '400px' : '0px', opacity: openIndex === index ? 1 : 0 }}
                >
                  <p className="p-body px-6 pb-6 md:px-8 md:pb-8">{item.answer}</p>
                </div>
              </div>
            </PReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
