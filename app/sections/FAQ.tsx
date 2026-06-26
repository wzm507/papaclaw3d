'use client'

import { useState } from 'react'
import Reveal from '../components/Reveal'
import AnimatedText from '../components/AnimatedText'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  title: string
  subtitle: string
  items: FAQItem[]
}

export default function FAQ({ title, subtitle, items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="section bg-warm-gray py-24 md:py-32">
      <div className="section-inner">
        <div className="mb-16 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="kicker mb-6">Standard Q&A</p>
            </Reveal>
            <AnimatedText as="h2" className="heading-lg">
              {title}
            </AnimatedText>
            <Reveal delay={0.2}>
              <p className="body-text mt-6">{subtitle}</p>
            </Reveal>
          </div>
        </div>

        <div className="grid gap-0 divide-y divide-ash-whisper border-t border-ash-whisper">
          {items.map((item, index) => (
            <Reveal key={index} delay={index * 0.05}>
              <div className="bg-paper-white transition-colors duration-300 hover:bg-warm-gray">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex w-full items-start justify-between px-6 py-6 text-left md:px-8 md:py-8"
                >
                  <span className="font-display text-lg font-semibold text-deep-forest md:text-xl">{item.question}</span>
                  <span className="ml-4 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-deep-forest text-deep-forest transition-transform duration-300 md:ml-8">
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
                  className="overflow-hidden transition-all duration-500 ease-expo"
                  style={{ maxHeight: openIndex === index ? '300px' : '0px', opacity: openIndex === index ? 1 : 0 }}
                >
                  <p className="body-text px-6 pb-6 md:px-8 md:pb-8">{item.answer}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
