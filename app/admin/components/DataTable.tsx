'use client'

import { Fragment, useMemo, useState } from 'react'

export interface DataTableColumn<T> {
  key: string
  label: string
  className?: string
  sortable?: boolean
  render?: (item: T, index: number) => React.ReactNode
}

interface DataTableSelection<T> {
  selected: Set<string | number>
  onSelect: (id: string | number, checked: boolean) => void
  onSelectAll?: (checked: boolean) => void
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  keyExtractor: (item: T, index: number) => string | number
  emptyText?: string
  selection?: DataTableSelection<T>
  expandedKey?: string | number | null
  renderExpanded?: (item: T, index: number) => React.ReactNode
}

function getValue<T>(item: T, key: string): unknown {
  return (item as Record<string, unknown>)[key]
}

function compareValues(a: unknown, b: unknown, direction: 'asc' | 'desc'): number {
  if (typeof a === 'number' && typeof b === 'number') {
    return direction === 'asc' ? a - b : b - a
  }
  const aStr = String(a ?? '')
  const bStr = String(b ?? '')
  return direction === 'asc'
    ? aStr.localeCompare(bStr, 'zh-CN')
    : bStr.localeCompare(aStr, 'zh-CN')
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyText = '暂无数据',
  selection,
  expandedKey,
  renderExpanded,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const sortedData = useMemo(() => {
    if (!sortKey) return data
    const direction = sortDirection
    return [...data].sort((a, b) => {
      const aVal = getValue(a, sortKey)
      const bVal = getValue(b, sortKey)
      return compareValues(aVal, bVal, direction)
    })
  }, [data, sortKey, sortDirection])

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const allSelected = data.length > 0 && data.every((item, index) => selection?.selected.has(keyExtractor(item, index)))

  return (
    <div className="overflow-hidden rounded-sm border border-[#E5E5E0] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E5E5E0] bg-[#F7F7F5] text-left">
              {selection && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => selection.onSelectAll?.(e.target.checked)}
                    className="h-4 w-4 rounded-sm border-[#E5E5E0] text-[#0F1C1A] focus:ring-[#B08D57]"
                    aria-label="全选"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#737373] ${
                    col.sortable ? 'cursor-pointer select-none' : ''
                  } ${col.className || ''}`}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <svg
                        className="h-3 w-3 text-[#0F1C1A]"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        {sortDirection === 'asc' ? (
                          <path d="M12 4l-8 8h16L12 4z" />
                        ) : (
                          <path d="M12 20l8-8H4l8 8z" />
                        )}
                      </svg>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selection ? 1 : 0)}
                  className="px-4 py-8 text-center text-sm text-[#737373]"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              sortedData.map((item, index) => {
                const rowId = keyExtractor(item, index)
                const expanded = expandedKey !== undefined && expandedKey !== null && rowId === expandedKey
                return (
                  <Fragment key={rowId}>
                    <tr
                      className="border-b border-[#E5E5E0] transition-colors last:border-b-0 hover:bg-[#F0EFEC]"
                    >
                      {selection && (
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selection.selected.has(rowId)}
                            onChange={(e) => selection.onSelect(rowId, e.target.checked)}
                            className="h-4 w-4 rounded-sm border-[#E5E5E0] text-[#0F1C1A] focus:ring-[#B08D57]"
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={`px-4 py-3 align-top text-[#0F1C1A] ${col.className || ''}`}
                        >
                          {col.render ? col.render(item, index) : String(getValue(item, col.key) ?? '')}
                        </td>
                      ))}
                    </tr>
                    {expanded && renderExpanded && (
                      <tr className="border-b border-[#E5E5E0] bg-[#F7F7F5]">
                        <td colSpan={columns.length + (selection ? 1 : 0)} className="p-0">
                          {renderExpanded(item, index)}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
