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
        <div className="relative h-full w-full overflow-hidden rounded-content border border-white/20 bg-midnight-ink shadow-[0_34px_90px_rgba(0,0,0,0.42)]">
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
            className="absolute -right-3 -top-3 rounded-content border border-white/20 bg-midnight-ink px-4 py-2 font-utility text-sm font-semibold text-white shadow-[0_14px_34px_rgba(0,0,0,0.28)] transform scale-0 animate-bubble-in"
            style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
          >
            {bubble}
          </div>
        )}
      </div>
    </div>
  )
}
