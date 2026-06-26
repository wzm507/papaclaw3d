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
    <div className="min-h-full p-6 md:p-10">
      {/* 顶部标题栏 */}
      <div className="mb-8 flex flex-col gap-4 border-b border-ash-whisper pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="kicker mb-2">Edit Content</p>
          <h1 className="font-sans text-3xl font-semibold leading-tight text-deep-forest">{title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {onPreview && (
            <button
              type="button"
              onClick={onPreview}
              disabled={saving}
              className="inline-flex min-h-11 items-center rounded-content border border-deep-forest bg-paper-white px-5 font-sans text-sm font-semibold text-deep-forest transition-colors hover:border-foudre-pink hover:text-foudre-pink disabled:cursor-not-allowed disabled:opacity-50"
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
