'use client'

interface AdminLoadingProps {
  text?: string
}

export default function AdminLoading({ text = '加载中...' }: AdminLoadingProps) {
  return (
    <div className="flex min-h-[12rem] flex-col items-center justify-center border border-[#E5E5E0] bg-white p-8 text-center">
      <svg
        className="mb-3 h-6 w-6 animate-spin text-[#B08D57]"
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
      <p className="text-sm text-[#737373]">{text}</p>
    </div>
  )
}
