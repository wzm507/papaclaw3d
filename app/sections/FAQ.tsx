'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Section3DBackground from '../components/Section3DBackground'

gsap.registerPlugin(ScrollTrigger)

const faqs = [
  {
    question: 'Quels types de clients accompagnez-vous ?',
    answer: 'Nous accompagnons des marques de toutes tailles, des startups aux grandes entreprises, qui souhaitent développer leur présence sur les réseaux sociaux.',
  },
  {
    question: 'Quels sont vos tarifs ?',
    answer: 'Nous proposons des solutions sur-mesure adaptées à vos besoins et votre budget. Chaque projet est unique, nous établissons un devis personnalisé après avoir compris vos objectifs.',
  },
  {
    question: 'Combien de temps dure un projet type ?',
    answer: 'La durée varie selon la complexité du projet. Une stratégie social media prend généralement 2-3 semaines, tandis qu\'un accompagnement complet se fait sur plusieurs mois.',
  },
  {
    question: 'Travaillez-vous avec des influenceurs ?',
    answer: 'Oui, nous avons un réseau d\'influenceurs dans divers domaines et pouvons organiser des campagnes de influencer marketing adaptées à votre marque.',
  },
  {
    question: 'Proposez-vous la formation ?',
    answer: 'Oui, nous proposons des formations sur mesure pour les équipes internes sur les réseaux sociaux, la création de contenu et le community management.',
  },
  {
    question: 'Comment mesurez-vous les résultats ?',
    answer: 'Nous utilisons des outils d\'analyse avancés et fournissons des rapports détaillés mensuels avec les KPIs pertinents pour votre activité.',
  },
]

export default function FAQ() {
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
    <section ref={sectionRef} className="section py-24 px-6 bg-ash-whisper relative overflow-hidden">
      <Section3DBackground theme="orange" />
      {/* 装饰背景元素 */}
      <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-foudre-pink/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-bubblegum-blush/10 blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Title */}
        <h2 ref={titleRef} className="text-heading-lg font-bold text-deep-forest text-center mb-6 opacity-0">
          Petites questions, grandes réponses
        </h2>
        <p className="text-body text-deep-forest/60 text-center mb-16">
          Tout ce que vous devez savoir avant de vous lancer.
        </p>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-content overflow-hidden transition-colors duration-300 ${openIndex === i ? 'bg-foudre-pink/10' : 'bg-white'}`}
            >
              <button
                onClick={() => toggleAccordion(i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className={`font-medium transition-colors duration-300 ${openIndex === i ? 'text-foudre-pink' : 'text-deep-forest'}`}>
                  {faq.question}
                </span>
                <span
                  className={`text-2xl transition-transform duration-300 ${openIndex === i ? 'rotate-45' : 'rotate-0'}`}
                >
                  +
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ${openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                style={{ transitionTimingFunction: 'cubic-bezier(.23,1,.32,1)' }}
              >
                <p className="px-6 pb-6 text-body text-deep-forest/70">
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
