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
        <div className="relative w-full h-full rounded-card overflow-hidden shadow-2xl">
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
            className="absolute -top-4 -right-4 bg-white rounded-full px-4 py-2 shadow-lg text-lg transform scale-0 animate-bubble-in"
            style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
          >
            {bubble}
          </div>
        )}
      </div>
    </div>
  )
}
