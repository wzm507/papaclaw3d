'use client'

import SaveButton from './SaveButton'

interface SectionEditorProps {
  title: string
  children: React.ReactNode
  onSave: () => void
  onPreview?: () => void
  saving?: boolean
}

export default function SectionEditor({
  title,
  children,
  onSave,
  onPreview,
  saving = false,
}: SectionEditorProps) {
  return (
    <div className="min-h-full">
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-ash-whisper">
        <h1 className="text-xl font-semibold text-deep-forest">{title}</h1>
        <div className="flex items-center gap-3">
          {onPreview && (
            <button
              type="button"
              onClick={onPreview}
              disabled={saving}
              className="px-4 py-2 rounded-lg border border-foudre-pink text-foudre-pink text-sm font-medium hover:bg-foudre-pink/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              预览
            </button>
          )}
          <SaveButton onSave={onSave} saving={saving} />
        </div>
      </div>

      {/* 内容区域 */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  )
}
