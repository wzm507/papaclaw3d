'use client'

import AdminButton from './AdminButton'

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onChange: (page: number) => void
}

export default function Pagination({ page, pageSize, total, onChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  if (total <= pageSize) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-end gap-2 border-t border-[#E5E5E0] bg-white px-4 py-3">
      <AdminButton
        variant="ghost"
        size="sm"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
      >
        上一页
      </AdminButton>
      <div className="flex items-center gap-1">
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`inline-flex h-8 w-8 items-center justify-center text-xs font-semibold transition-colors ${
              p === page
                ? 'bg-[#0F1C1A] text-white'
                : 'text-[#0F1C1A] hover:bg-[#F0EFEC]'
            }`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        ))}
      </div>
      <AdminButton
        variant="ghost"
        size="sm"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        下一页
      </AdminButton>
    </div>
  )
}
