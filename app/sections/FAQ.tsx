'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Section3DBackground from '../components/Section3DBackground'

gsap.registerPlugin(ScrollTrigger)

interface FAQProps {
  title: string
  subtitle: string
  items: { question: string; answer: string }[]
}

export default function FAQ({ title, subtitle, items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section ref={sectionRef} className="editorial-section bg-ash-whisper">
      <Section3DBackground theme="orange" />
      <div className="absolute inset-x-6 top-10 border-t border-deep-forest/15" />

      <div className="max-w-4xl mx-auto relative z-10">
        <p className="editorial-kicker text-center mb-4">Standard Q&A</p>
        <h2 ref={titleRef} className="editorial-heading text-center mb-6 opacity-0">
          {title}
        </h2>
        <p className="editorial-body text-center mb-16 editorial-measure mx-auto">
          {subtitle}
        </p>

        <div className="border-y border-deep-forest/20">
          {items.map((faq, i) => (
            <div
              key={i}
              className={`overflow-hidden border-b border-deep-forest/15 last:border-b-0 transition-colors duration-300 ${openIndex === i ? 'bg-paper-white/85' : 'bg-transparent'}`}
            >
              <button
                onClick={() => toggleAccordion(i)}
                className="w-full flex items-start justify-between gap-6 p-6 text-left md:p-7"
                aria-expanded={openIndex === i}
              >
                <span className={`font-editorial text-xl font-bold leading-snug transition-colors duration-300 ${openIndex === i ? 'text-foudre-pink' : 'text-deep-forest'}`}>
                  {faq.question}
                </span>
                <span
                  className={`font-utility text-2xl leading-none transition-transform duration-300 ${openIndex === i ? 'rotate-45 text-foudre-pink' : 'rotate-0 text-deep-forest/60'}`}
                >
                  +
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ${openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                style={{ transitionTimingFunction: 'cubic-bezier(.23,1,.32,1)' }}
              >
                <p className="editorial-body px-6 pb-7 md:px-7">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
