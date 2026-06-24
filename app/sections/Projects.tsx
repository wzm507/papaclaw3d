'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ProjectsProps {
  title: string
  items: { id: string; title: string; thumbnail: string; tags: string[] }[]
}

export default function Projects({ title, items }: ProjectsProps) {
  const [activeProject, setActiveProject] = useState(0)
  const [liked, setLiked] = useState<string[]>([])
  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const thumbnailsRef = useRef<HTMLDivElement>(null)
  const mainImageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=250%',
          pin: stickyRef.current,
          scrub: 0.5,
          pinSpacing: true,
          onUpdate: (self) => {
            const progress = self.progress
            const newIndex = Math.min(
              Math.floor(progress * items.length),
              items.length - 1
            )
            setActiveProject(newIndex)
          },
        },
      })

      tl.fromTo(
        titleRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0
      )

      const thumbnails = thumbnailsRef.current?.querySelectorAll('.project-thumb') || []
      tl.fromTo(
        thumbnails,
        { y: 40, opacity: 0, scale: 0.85 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.05, ease: 'power2.out' },
        0.15
      )

      tl.fromTo(
        mainImageRef.current,
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'power2.out' },
        0.25
      )

      tl.to(
        titleRef.current,
        { y: -40, opacity: 0, ease: 'power2.in' },
        0.6
      )

      tl.to(
        thumbnailsRef.current,
        { y: -20, opacity: 0, ease: 'power2.in' },
        0.65
      )

      tl.to(
        mainImageRef.current,
        { y: -60, scale: 0.95, opacity: 0, ease: 'power2.in' },
        0.7
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [items.length])

  const toggleLike = (id: string) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  return (
    <section ref={sectionRef} className="relative w-full" style={{ height: '350vh' }}>
      <div
        ref={stickyRef}
        className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden px-6 py-8"
        style={{ willChange: 'transform' }}
      >
        <div className="absolute inset-0 bg-paper-white" />
        <div className="absolute inset-x-6 top-10 border-t border-deep-forest/10" />
        <div className="absolute inset-x-6 bottom-10 border-t border-deep-forest/10" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-center">
          <p className="editorial-kicker text-center mb-4">Five Service Lines</p>
          <h2
            ref={titleRef}
            className="text-safe mx-auto mb-6 max-w-[16ch] text-center font-utility text-[clamp(1.9rem,4vw,3.6rem)] font-semibold leading-[1.08] text-deep-forest md:max-w-[20ch]"
            style={{ willChange: 'transform, opacity' }}
          >
            {title}
          </h2>

          <div
            ref={thumbnailsRef}
            className="mb-6 flex flex-wrap justify-center gap-3"
            style={{ willChange: 'transform, opacity' }}
          >
            {items.map((project, i) => (
              <button
                key={project.id}
                onClick={() => setActiveProject(i)}
                className={`project-thumb relative h-20 w-20 overflow-hidden rounded-content border bg-white transition-all duration-300 md:h-24 md:w-24 ${
                  i === activeProject ? 'border-deep-forest opacity-100 scale-105 shadow-[0_14px_34px_rgba(0,0,0,0.18)]' : 'border-ash-whisper opacity-60 shadow-[0_10px_28px_rgba(0,0,0,0.06)] hover:opacity-100'
                }`}
                aria-label={`查看${project.title}`}
              >
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  width={96}
                  height={96}
                  loading="lazy"
                />
              </button>
            ))}
          </div>

          <div
            ref={mainImageRef}
            className="relative w-full"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="neo-surface relative mx-auto aspect-[16/9] max-h-[48vh] overflow-hidden rounded-content p-1">
              <img
                src={items[activeProject].thumbnail}
                alt={items[activeProject].title}
                className="w-full h-full object-cover transition-transform duration-700"
                width={800}
                height={450}
                loading="eager"
              />

              <div className="absolute bottom-1 left-1 right-1 rounded-b-[6px] bg-gradient-to-t from-midnight-ink/88 via-midnight-ink/54 to-transparent p-5 md:p-7">
                <p className="font-utility text-xs uppercase text-white/65 mb-2">Papa Claw Capability</p>
                <h3 className="text-safe mb-3 font-utility text-[clamp(1.35rem,2.5vw,2.1rem)] font-semibold leading-tight text-white">
                  {items[activeProject].title}
                </h3>
                <div className="mb-4 flex flex-wrap gap-2">
                  {items[activeProject].tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-safe rounded-content border border-white/22 bg-white/12 px-3 py-1 font-utility text-sm leading-tight text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href="#ai-source"
                  className="font-utility text-sm font-semibold text-white underline underline-offset-4 hover:text-bubblegum-blush transition-colors"
                >
                  查看业务专题
                </a>
              </div>

              <button
                onClick={() => toggleLike(items[activeProject].id)}
                className={`absolute right-4 top-4 flex min-h-11 min-w-12 items-center justify-center rounded-content border px-3 font-utility text-sm font-semibold transition-all duration-300 ${
                  liked.includes(items[activeProject].id)
                    ? 'border-bubblegum-blush bg-bubblegum-blush text-deep-forest'
                    : 'border-white/30 bg-black/20 text-white'
                }`}
              >
                {liked.includes(items[activeProject].id) ? '已选' : '关注'}
              </button>
            </div>

            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() => setActiveProject((prev) => (prev - 1 + items.length) % items.length)}
                className="flex h-12 w-12 items-center justify-center rounded-content border border-deep-forest/10 bg-deep-forest text-white shadow-[0_14px_34px_rgba(16,35,31,0.14)] transition-colors hover:bg-foudre-pink"
                aria-label="上一个业务板块"
              >
                ←
              </button>
              <div className="flex gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveProject(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === activeProject ? 'bg-foudre-pink w-6' : 'bg-deep-forest/24'
                    }`}
                    aria-label={`切换到第${i + 1}个业务板块`}
                  />
                ))}
              </div>
              <button
                onClick={() => setActiveProject((prev) => (prev + 1) % items.length)}
                className="flex h-12 w-12 items-center justify-center rounded-content border border-deep-forest/10 bg-deep-forest text-white shadow-[0_14px_34px_rgba(16,35,31,0.14)] transition-colors hover:bg-foudre-pink"
                aria-label="下一个业务板块"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
