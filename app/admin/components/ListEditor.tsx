'use client'

import { useCallback, useState } from 'react'
import ConfirmDialog from './ConfirmDialog'

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
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleItemChange = useCallback(
    (index: number, updatedItem: T) => {
      const newItems = [...items]
      newItems[index] = updatedItem
      onChange(newItems)
    },
    [items, onChange]
  )

  const handleAdd = useCallback(() => {
    onChange([...items, addItem()])
  }, [items, onChange, addItem])

  const handleRemove = useCallback(
    (index: number) => {
      onChange(items.filter((_, i) => i !== index))
      setDeleteIndex(null)
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

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }

  const handleDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (targetIndex: number) => (e: React.DragEvent) => {
    e.preventDefault()
    const sourceIndex = Number(e.dataTransfer.getData('text/plain'))
    if (sourceIndex === targetIndex || Number.isNaN(sourceIndex)) {
      setDragOverIndex(null)
      return
    }
    const newItems = [...items]
    const [moved] = newItems.splice(sourceIndex, 1)
    newItems.splice(targetIndex, 0, moved)
    onChange(newItems)
    setDragOverIndex(null)
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          draggable
          onDragStart={handleDragStart(index)}
          onDragOver={handleDragOver(index)}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop(index)}
          className={`relative border bg-white p-4 transition-all duration-200 hover:border-[#0F1C1A] ${
            dragOverIndex === index ? 'border-[#B08D57] bg-[#F7F7F5]' : 'border-[#E5E5E0]'
          }`}
        >
          {/* 操作按钮组 */}
          <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-[#E5E5E0] pb-3">
            <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-[#737373]">
              #{index + 1}
            </span>
            <button
              type="button"
              onClick={() => handleMoveUp(index)}
              disabled={index === 0}
              className="inline-flex h-8 items-center border border-[#E5E5E0] px-2 text-xs font-semibold text-[#737373] transition-colors hover:border-[#0F1C1A] hover:text-[#0F1C1A] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="上移"
            >
              ↑ 上移
            </button>
            <button
              type="button"
              onClick={() => handleMoveDown(index)}
              disabled={index === items.length - 1}
              className="inline-flex h-8 items-center border border-[#E5E5E0] px-2 text-xs font-semibold text-[#737373] transition-colors hover:border-[#0F1C1A] hover:text-[#0F1C1A] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="下移"
            >
              ↓ 下移
            </button>
            <button
              type="button"
              className="inline-flex h-8 cursor-move items-center border border-[#E5E5E0] px-2 text-xs font-semibold text-[#737373] transition-colors hover:border-[#0F1C1A] hover:text-[#0F1C1A]"
              aria-label="拖拽排序"
            >
              ⠿ 拖动
            </button>
            <button
              type="button"
              onClick={() => setDeleteIndex(index)}
              className="ml-auto inline-flex h-8 items-center border border-red-200 px-2 text-xs font-semibold text-red-600 transition-colors hover:border-red-500 hover:bg-red-50"
              aria-label="删除"
            >
              ✕ 删除
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
        className="min-h-10 w-full border border-dashed border-[#E5E5E0] py-2 text-sm font-semibold text-[#737373] transition-colors hover:border-[#B08D57] hover:text-[#B08D57]"
      >
        + 添加{itemLabel}
      </button>

      <ConfirmDialog
        open={deleteIndex !== null}
        title="确认删除"
        description={`确定要删除这个${itemLabel}吗？删除后无法恢复。`}
        confirmText="删除"
        cancelText="取消"
        variant="danger"
        onConfirm={() => deleteIndex !== null && handleRemove(deleteIndex)}
        onCancel={() => setDeleteIndex(null)}
      />
    </div>
  )
}
