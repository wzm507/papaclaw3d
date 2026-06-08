import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const createScrollAnimations = () => {
  // 为所有section添加基本的进入动画
  gsap.utils.toArray<HTMLElement>('.section').forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      onEnter: () => section.classList.add('is-inview'),
      onLeaveBack: () => section.classList.remove('is-inview'),
    })
  })
}

export const animateLogoLetters = () => {
  const letters = gsap.utils.toArray<HTMLElement>('.logo-letter')
  gsap.fromTo(
    letters,
    { y: 100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.05,
      ease: 'power3.out',
    }
  )
}

export const cardTilt = (e: React.MouseEvent<HTMLElement>, card: HTMLElement) => {
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2

  const rotateX = (y - centerY) / 20
  const rotateY = (centerX - x) / 20

  gsap.to(card, {
    rotateX,
    rotateY,
    duration: 0.4,
    ease: 'power2.out',
  })
}

export const resetCardTilt = (card: HTMLElement) => {
  gsap.to(card, {
    rotateX: 0,
    rotateY: 0,
    duration: 0.4,
    ease: 'power2.out',
  })
}
