'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const teamMembers = [
  { name: 'Margaux', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=600&fit=crop' },
  { name: 'Mathieu', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop' },
  { name: 'Florent', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=600&fit=crop' },
  { name: 'Johane', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=600&fit=crop' },
  { name: 'Lou', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=600&fit=crop' },
]

export default function Team() {
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
              Math.floor(progress * teamMembers.length),
              teamMembers.length - 1
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
  }, [])

  return (
    <section ref={sectionRef} className="relative w-full" style={{ height: '300vh' }}>
      <div
        ref={stickyRef}
        className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden py-12 px-6 bg-ash-whisper"
      >
        {/* Title */}
        <h2 ref={titleRef} className="text-heading-lg font-bold text-deep-forest text-center mb-4 opacity-0">
          Nous électrisons <em className="text-foudre-pink">vos réseaux,</em>
        </h2>

        {/* Chat Bubbles */}
        <div className="flex justify-center gap-4 mb-8">
          {['📱', '⚡️', '😜'].map((emoji, i) => (
            <div
              key={i}
              className="bg-white rounded-full px-4 py-2 shadow-md text-2xl transform hover:scale-110 transition-transform"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {emoji}
            </div>
          ))}
        </div>

        {/* Team Photo */}
        <div
          ref={imageContainerRef}
          className="relative w-full max-w-md mx-auto aspect-[4/5] mb-6 rounded-card overflow-hidden flex-shrink-0"
          style={{ willChange: 'transform, opacity', maxHeight: '55vh' }}
        >
          {teamMembers.map((member, i) => (
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
        <div ref={buttonsRef} className="flex flex-wrap justify-center gap-3" style={{ willChange: 'transform, opacity' }}>
          {teamMembers.map((member, i) => (
            <button
              key={i}
              onClick={() => setActiveMember(i)}
              className={`px-6 py-3 rounded-badge font-medium transition-all duration-300 ${
                i === activeMember ? 'bg-foudre-pink text-white' : 'bg-white text-deep-forest hover:bg-bubblegum-blush'
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
