'use client'

interface StatusBadgeProps {
  variant?: 'success' | 'error' | 'warning' | 'default' | 'disabled'
  children: React.ReactNode
}

export default function StatusBadge({ variant = 'default', children }: StatusBadgeProps) {
  const classes = {
    success: 'border-green-200 bg-green-50 text-green-700',
    error: 'border-red-200 bg-red-50 text-red-600',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-700',
    default: 'border-[#E5E5E0] bg-white text-[#0F1C1A]',
    disabled: 'border-[#E5E5E0] bg-[#F7F7F5] text-[#737373]',
  }

  return (
    <span
      className={`inline-flex items-center border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${classes[variant]}`}
    >
      {children}
    </span>
  )
}
