'use client'

import { cn } from '@/app/lib/utils'

interface AdminPanelProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md'
  shadow?: boolean
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
}

export default function AdminPanel({
  children,
  className = '',
  padding = 'md',
  shadow = false,
}: AdminPanelProps) {
  return (
    <div
      className={cn(
        'border border-[#E5E5E0] bg-white rounded-sm',
        paddingClasses[padding],
        shadow && 'shadow-[0_4px_20px_rgba(0,0,0,0.06)]',
        className
      )}
    >
      {children}
    </div>
  )
}
