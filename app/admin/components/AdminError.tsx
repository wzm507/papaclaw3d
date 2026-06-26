'use client'

interface AdminErrorProps {
  text?: string
  onRetry?: () => void
}

export default function AdminError({
  text = '加载失败，请重试',
  onRetry,
}: AdminErrorProps) {
  return (
    <div className="flex min-h-[12rem] flex-col items-center justify-center border border-red-200 bg-red-50 p-8 text-center">
      <p className="text-sm font-semibold text-red-600">{text}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex h-9 items-center border border-red-200 bg-white px-4 text-xs font-semibold text-red-600 transition-colors hover:border-red-500"
        >
          重新加载
        </button>
      )}
    </div>
  )
}
