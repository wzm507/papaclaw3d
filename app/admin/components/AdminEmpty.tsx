'use client'

interface AdminEmptyProps {
  title?: string
  description?: string
  action?: React.ReactNode
}

export default function AdminEmpty({
  title = '暂无数据',
  description,
  action,
}: AdminEmptyProps) {
  return (
    <div className="flex min-h-[10rem] flex-col items-center justify-center border border-dashed border-[#E5E5E0] bg-white p-8 text-center">
      <p className="text-sm font-semibold text-[#0F1C1A]">{title}</p>
      {description && <p className="mt-1 text-xs text-[#737373]">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
