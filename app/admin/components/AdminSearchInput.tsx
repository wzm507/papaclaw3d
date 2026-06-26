'use client'

interface AdminSearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function AdminSearchInput({
  value,
  onChange,
  placeholder = '搜索...',
  className = '',
}: AdminSearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#737373]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-sm border border-[#E5E5E0] bg-white py-2 pl-9 pr-3 text-sm text-[#0F1C1A] placeholder:text-[#737373]/60 transition-all focus:border-[#B08D57] focus:outline-none focus:ring-2 focus:ring-[#B08D57]/30"
      />
    </div>
  )
}
