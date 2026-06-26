'use client'

import { useCallback } from 'react'

interface ListEditorProps<T> {
  items: T[]
  onChange: (items: T[]) => void
  renderItem: (item: T, index: number, onChange: (item: T) => void) => React.ReactNode
  addItem: () => T
  itemLabel?: string
}

export default function ListEditor<T>({
  items,
  onChange,
  renderItem,
  addItem,
  itemLabel = '项目',
}: ListEditorProps<T>) {
  const handleItemChange = useCallback(
    (index: number, updatedItem: T) => {
      const newItems = [...items]
      newItems[index] = updatedItem
      onChange(newItems)
    },
    [items, onChange]
  )

  const handleAdd = useCallback(() => {
    const newItem = addItem()
    onChange([...items, newItem])
  }, [items, onChange, addItem])

  const handleRemove = useCallback(
    (index: number) => {
      const newItems = items.filter((_, i) => i !== index)
      onChange(newItems)
    },
    [items, onChange]
  )

  const handleMoveUp = useCallback(
    (index: number) => {
      if (index === 0) return
      const newItems = [...items]
      ;[newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]]
      onChange(newItems)
    },
    [items, onChange]
  )

  const handleMoveDown = useCallback(
    (index: number) => {
      if (index === items.length - 1) return
      const newItems = [...items]
      ;[newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]]
      onChange(newItems)
    },
    [items, onChange]
  )

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="relative rounded-content border border-ash-whisper bg-paper-white p-5 transition-all duration-200 hover:border-deep-forest hover:shadow-[0_18px_44px_rgba(0,0,0,0.06)]"
        >
          {/* 操作按钮组 */}
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleMoveUp(index)}
              disabled={index === 0}
              className="flex h-8 w-8 items-center justify-center rounded-content border border-ash-whisper text-xs text-slate-tint transition-colors hover:border-deep-forest hover:text-deep-forest disabled:cursor-not-allowed disabled:opacity-30"
              title="上移"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => handleMoveDown(index)}
              disabled={index === items.length - 1}
              className="flex h-8 w-8 items-center justify-center rounded-content border border-ash-whisper text-xs text-slate-tint transition-colors hover:border-deep-forest hover:text-deep-forest disabled:cursor-not-allowed disabled:opacity-30"
              title="下移"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="flex h-8 w-8 items-center justify-center rounded-content border border-ash-whisper text-sm text-red-500 transition-colors hover:border-red-500 hover:bg-red-50"
              title="删除"
            >
              ✕
            </button>
          </div>

          {/* 项目内容 */}
          {renderItem(item, index, (updatedItem) => handleItemChange(index, updatedItem))}
        </div>
      ))}

      {/* 添加按钮 */}
      <button
        type="button"
        onClick={handleAdd}
        className="min-h-11 w-full rounded-content border border-dashed border-ash-whisper py-2.5 font-sans text-sm font-semibold text-slate-tint transition-colors hover:border-foudre-pink hover:text-foudre-pink"
      >
        + 添加{itemLabel}
      </button>
    </div>
  )
}
