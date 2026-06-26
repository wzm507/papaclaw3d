'use client'

interface ToolbarProps {
  children: React.ReactNode
  className?: string
}

export default function Toolbar({ children, className = '' }: ToolbarProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-3 border-b border-[#E5E5E0] bg-white px-4 py-3 ${className}`}
    >
      {children}
    </div>
  )
}
