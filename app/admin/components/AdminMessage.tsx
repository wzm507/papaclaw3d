'use client'

import { cn } from '@/app/lib/utils'

interface AdminMessageProps {
  variant?: 'success' | 'error' | 'warning' | 'info'
  children: React.ReactNode
  onClose?: () => void
  className?: string
}

const variantClasses = {
  success: 'border-green-200 bg-green-50 text-green-700',
  error: 'border-red-200 bg-red-50 text-red-600',
  warning: 'border-yellow-200 bg-yellow-50 text-yellow-700',
  info: 'border-[#B08D57]/30 bg-white text-[#0F1C1A]',
}

export default function AdminMessage({
  variant = 'info',
  children,
  onClose,
  className = '',
}: AdminMessageProps) {
  return (
    <div
      className={cn(
        'mb-5 flex items-start justify-between gap-3 rounded-sm border px-4 py-3 text-sm font-semibold',
        variantClasses[variant],
        className
      )}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <span>{children}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-[#737373] transition-colors hover:text-[#0F1C1A]"
          aria-label="关闭"
        >
          ✕
        </button>
      )}
    </div>
  )
}
