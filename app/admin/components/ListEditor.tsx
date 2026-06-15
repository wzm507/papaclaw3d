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
          className="relative bg-white border border-ash-whisper rounded-lg p-4 transition-all duration-200 hover:border-bubblegum-blush"
        >
          {/* 操作按钮组 */}
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleMoveUp(index)}
              disabled={index === 0}
              className="w-6 h-6 flex items-center justify-center rounded text-deep-forest/50 hover:text-deep-forest hover:bg-ash-whisper disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
              title="上移"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => handleMoveDown(index)}
              disabled={index === items.length - 1}
              className="w-6 h-6 flex items-center justify-center rounded text-deep-forest/50 hover:text-deep-forest hover:bg-ash-whisper disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
              title="下移"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="w-6 h-6 flex items-center justify-center rounded text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors text-sm"
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
        className="w-full py-2.5 border-2 border-dashed border-ash-whisper rounded-lg text-sm text-deep-forest/60 hover:border-foudre-pink hover:text-foudre-pink transition-colors"
      >
        + 添加{itemLabel}
      </button>
    </div>
  )
}
