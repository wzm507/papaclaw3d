'use client'

interface TextMarqueeProps {
  text: string
  className?: string
  speed?: number
  reverse?: boolean
}

export default function TextMarquee({ text, className = '', speed = 30, reverse = false }: TextMarqueeProps) {
  const repeated = `${text} · ${text} · ${text} · ${text} · `
  return (
    <div className={`group overflow-hidden whitespace-nowrap ${className}`}>
      <div
        className="inline-flex will-change-transform"
        style={{ animation: `marquee ${speed}s linear infinite ${reverse ? 'reverse' : 'normal'}` }}
      >
        <span className="pr-8">{repeated}</span>
        <span className="pr-8">{repeated}</span>
      </div>
    </div>
  )
}
