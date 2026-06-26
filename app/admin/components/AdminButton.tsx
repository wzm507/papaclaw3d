'use client'

import { ButtonHTMLAttributes, Children, cloneElement, forwardRef, isValidElement, Ref } from 'react'

export interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'xs' | 'sm' | 'md'
  loading?: boolean
  asChild?: boolean
}

const AdminButton = forwardRef<HTMLButtonElement, AdminButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      loading = false,
      asChild = false,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center gap-2 rounded-sm border font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60'

    const variantClasses = {
      primary:
        'border-[#0F1C1A] bg-[#0F1C1A] text-white hover:border-[#B08D57] hover:bg-[#B08D57]',
      secondary:
        'border-[#E5E5E0] bg-white text-[#0F1C1A] hover:border-[#0F1C1A]',
      danger:
        'border-red-200 bg-white text-red-600 hover:border-red-500 hover:bg-red-50',
      ghost:
        'border-transparent bg-transparent text-[#737373] hover:text-[#0F1C1A]',
    }

    const sizeClasses = {
      xs: 'h-7 px-2 text-xs',
      sm: 'h-9 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
    }

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

    if (asChild && isValidElement(children)) {
      const child = Children.only(children)
      return cloneElement(child, {
        className: `${combinedClasses} ${child.props.className || ''}`.trim(),
        ...props,
      })
    }

    return (
      <button
        ref={ref}
        className={combinedClasses}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

AdminButton.displayName = 'AdminButton'

export default AdminButton
