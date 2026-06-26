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
      <div className="mb-8 flex flex-col gap-4 border-b border-[#E5E5E0] pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="p-kicker mb-2">Edit Content</p>
          <h1 className="text-3xl font-semibold leading-tight text-[#0F1C1A]">{title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {onPreview && (
            <button
              type="button"
              onClick={onPreview}
              disabled={saving}
              className="inline-flex min-h-11 items-center border border-[#0F1C1A] bg-white px-5 text-sm font-semibold text-[#0F1C1A] transition-all hover:-translate-y-0.5 hover:border-[#B08D57] hover:text-[#B08D57] disabled:cursor-not-allowed disabled:opacity-50"
            >
              预览
            </button>
          )}
          <SaveButton onSave={onSave} saving={saving} />
        </div>
      </div>

      <div className="space-y-6">
        {children}
      </div>
    </div>
  )
}
