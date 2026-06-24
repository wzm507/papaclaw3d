'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TeamProps {
  title: string
  members: { name: string; image: string }[]
}

export default function Team({ title, members }: TeamProps) {
  const [activeMember, setActiveMember] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
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

      // Sticky scroll animation for images
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          pin: stickyRef.current,
          scrub: 0.5,
          pinSpacing: true,
          onUpdate: (self) => {
            // Update active member based on scroll progress
            const progress = self.progress
            const newIndex = Math.min(
              Math.floor(progress * members.length),
              members.length - 1
            )
            setActiveMember(newIndex)
          },
        },
      })

      // Image container animation
      tl.fromTo(
        imageContainerRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'power2.out' },
        0
      )

      // Buttons animation
      tl.fromTo(
        buttonsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0.1
      )

      // Fade out at the end
      tl.to(
        [imageContainerRef.current, buttonsRef.current],
        { y: -50, opacity: 0, ease: 'power2.in' },
        0.7
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [members.length])

  return (
    <section ref={sectionRef} className="relative w-full" style={{ height: '300vh' }}>
      <div
        ref={stickyRef}
        className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-pale-canvas px-5 pb-8 pt-24 md:px-6 md:pb-10 md:pt-24"
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#f5f5f7_0%,#ffffff_54%,#f5f5f7_100%)]" />
        <div className="absolute inset-x-6 top-10 border-t border-deep-forest/10" />
        {/* Title */}
        <h2 ref={titleRef} className="text-safe mx-auto mb-5 max-w-[15ch] text-center font-utility text-[clamp(2rem,4.4vw,3.9rem)] font-semibold leading-[1.08] text-deep-forest opacity-0 md:max-w-[18ch]">
          {title}
        </h2>

        {/* Chat Bubbles */}
        <div className="mb-6 flex max-w-full flex-wrap justify-center gap-3 md:mb-8">
          {['AI数据', '政企资源', '务实落地'].map((label, i) => (
            <div
              key={i}
              className="rounded-content border border-ash-whisper bg-paper-white px-4 py-2 font-utility text-sm font-semibold text-deep-forest shadow-[0_12px_34px_rgba(0,0,0,0.05)] transition-transform hover:-translate-y-0.5"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Team Photo */}
        <div
          ref={imageContainerRef}
          className="neo-surface relative mx-auto mb-5 aspect-[4/5] w-full max-w-sm flex-shrink overflow-hidden rounded-content md:max-w-md"
          style={{ willChange: 'transform, opacity', maxHeight: '42vh' }}
        >
          {members.map((member, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-all duration-500 ${
                i === activeMember ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(.23,1,.32,1)' }}
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
                width={500}
                height={600}
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Member Names */}
        <div ref={buttonsRef} className="flex max-w-3xl flex-wrap justify-center gap-3" style={{ willChange: 'transform, opacity' }}>
          {members.map((member, i) => (
            <button
              key={i}
              onClick={() => setActiveMember(i)}
              className={`text-safe min-h-11 rounded-content border px-5 py-3 font-utility text-sm font-semibold leading-tight transition-all duration-300 md:px-6 ${
                i === activeMember ? 'border-deep-forest bg-deep-forest text-white shadow-[0_14px_34px_rgba(0,0,0,0.18)]' : 'border-ash-whisper bg-paper-white text-deep-forest hover:border-foudre-pink/40'
              }`}
            >
              {member.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
