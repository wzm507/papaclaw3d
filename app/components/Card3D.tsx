'use client'

import { useRef } from 'react'
import { cardTilt, resetCardTilt } from '../lib/animations'

interface Card3DProps {
  image: string
  bubble?: string
  index: number
  isActive: boolean
}

export default function Card3D({ image, bubble, isActive }: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (cardRef.current) {
      cardTilt(e, cardRef.current)
    }
  }

  const handleMouseLeave = () => {
    if (cardRef.current) {
      resetCardTilt(cardRef.current)
    }
  }

  return (
    <div
      className={`absolute inset-0 transition-all duration-700 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
      style={{ transitionTimingFunction: 'cubic-bezier(.23,1,.32,1)' }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-full preserve-3d"
        style={{ perspective: '1000px' }}
      >
        <div className="relative w-full h-full rounded-card overflow-hidden border border-paper-white/70 shadow-[0_28px_90px_rgba(17,17,15,0.28)]">
          <img
            src={image}
            alt="Team member"
            className="w-full h-full object-cover"
            width={600}
            height={800}
            loading="eager"
          />
        </div>

        {bubble && (
          <div
            className="absolute -top-3 -right-3 border border-deep-forest/25 bg-paper-white px-4 py-2 font-utility text-sm font-semibold text-deep-forest shadow-[0_8px_24px_rgba(17,17,15,0.12)] transform scale-0 animate-bubble-in"
            style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
          >
            {bubble}
          </div>
        )}
      </div>
    </div>
  )
}
