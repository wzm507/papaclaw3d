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
            // Update active project based on scroll progress
            const progress = self.progress
            const newIndex = Math.min(
              Math.floor(progress * items.length),
              items.length - 1
            )
            setActiveProject(newIndex)
          },
        },
      })

      // Phase 1: 标题从下方滑入 (0% - 25%)
      tl.fromTo(
        titleRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0
      )

      // Phase 2: 缩略图从两侧飞入 (15% - 40%)
      const thumbnails = thumbnailsRef.current?.querySelectorAll('.project-thumb') || []
      tl.fromTo(
        thumbnails,
        { y: 40, opacity: 0, scale: 0.85 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.05, ease: 'power2.out' },
        0.15
      )

      // Phase 3: 主图缩放进入 (25% - 50%)
      tl.fromTo(
        mainImageRef.current,
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'power2.out' },
        0.25
      )

      // Phase 4: 内容视差 + 淡出 (60% - 100%)
      // 保持背景可见，避免空白区域
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
  }, [])

  const toggleLike = (id: string) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  return (
    <section ref={sectionRef} className="relative w-full" style={{ height: '350vh' }}>
      <div
        ref={stickyRef}
        className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden py-8 px-6"
        style={{ willChange: 'transform' }}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-pale-canvas" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col h-full justify-center">
          {/* Title */}
          <h2
            ref={titleRef}
            className="text-heading-lg font-bold text-deep-forest text-center mb-6"
            style={{ willChange: 'transform, opacity' }}
          >
            {title}
          </h2>

          {/* Project Thumbnails */}
          <div
            ref={thumbnailsRef}
            className="flex flex-wrap justify-center gap-4 mb-6"
            style={{ willChange: 'transform, opacity' }}
          >
            {items.map((project, i) => (
              <button
                key={project.id}
                onClick={() => setActiveProject(i)}
                className={`project-thumb relative w-24 h-24 rounded-card overflow-hidden transition-all duration-300 ${
                  i === activeProject ? 'ring-4 ring-foudre-pink scale-110' : 'opacity-60 hover:opacity-100'
                }`}
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

          {/* Active Project */}
          <div
            ref={mainImageRef}
            className="relative w-full"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="relative aspect-[16/9] max-h-[45vh] rounded-content overflow-hidden mx-auto">
              <img
                src={items[activeProject].thumbnail}
                alt={items[activeProject].title}
                className="w-full h-full object-cover transition-transform duration-700"
                width={800}
                height={450}
                loading="eager"
              />

              {/* Project Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {items[activeProject].title}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {items[activeProject].tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-badge text-white text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href="#"
                  className="text-white underline hover:text-foudre-pink transition-colors"
                >
                  Consulter le projet
                </a>
              </div>

              {/* Love Button */}
              <button
                onClick={() => toggleLike(items[activeProject].id)}
                className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
                  liked.includes(items[activeProject].id)
                    ? 'bg-foudre-pink text-white scale-110'
                    : 'bg-white/20 backdrop-blur-sm text-white'
                }`}
              >
                {liked.includes(items[activeProject].id) ? '❤️' : '🤍'}
              </button>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() => setActiveProject((prev) => (prev - 1 + items.length) % items.length)}
                className="w-12 h-12 rounded-full bg-deep-forest text-white flex items-center justify-center hover:bg-foudre-pink transition-colors"
              >
                ←
              </button>
              <div className="flex gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveProject(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === activeProject ? 'bg-foudre-pink w-6' : 'bg-deep-forest/30'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setActiveProject((prev) => (prev + 1) % items.length)}
                className="w-12 h-12 rounded-full bg-deep-forest text-white flex items-center justify-center hover:bg-foudre-pink transition-colors"
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
