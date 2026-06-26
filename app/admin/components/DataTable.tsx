'use client'

export interface DataTableColumn<T> {
  key: string
  label: string
  className?: string
  render?: (item: T, index: number) => React.ReactNode
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  keyExtractor: (item: T, index: number) => string | number
  emptyText?: string
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyText = '暂无数据',
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto border border-[#E5E5E0] bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E5E5E0] bg-[#F7F7F5] text-left">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#737373] ${col.className || ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-sm text-[#737373]"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={keyExtractor(item, index)}
                className="border-b border-[#E5E5E0] transition-colors last:border-b-0 hover:bg-[#F0EFEC]"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 align-top text-[#0F1C1A] ${col.className || ''}`}
                  >
                    {col.render ? col.render(item, index) : String((item as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
