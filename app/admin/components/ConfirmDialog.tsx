'use client'

import { useEffect, useRef } from 'react'
import AdminButton from './AdminButton'

interface ConfirmDialogProps {
  open: boolean
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'default'
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title = '确认操作',
  description = '此操作不可撤销，是否继续？',
  confirmText = '确认',
  cancelText = '取消',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) cancelRef.current?.focus()
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1C1A]/60 p-4">
      <div
        className="w-full max-w-sm border border-[#E5E5E0] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
      >
        <h3 id="confirm-title" className="text-lg font-semibold text-[#0F1C1A]">
          {title}
        </h3>
        <p id="confirm-desc" className="mt-2 text-sm leading-relaxed text-[#737373]">
          {description}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <AdminButton variant="ghost" onClick={onCancel} ref={cancelRef}>
            {cancelText}
          </AdminButton>
          <AdminButton
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
          >
            {confirmText}
          </AdminButton>
        </div>
      </div>
    </div>
  )
}
