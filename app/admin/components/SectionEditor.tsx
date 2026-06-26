'use client'

import AdminPageHeader from './AdminPageHeader'
import AdminButton from './AdminButton'
import AdminPanel from './AdminPanel'

interface SectionEditorProps {
  title: string
  kicker?: string
  description?: string
  children: React.ReactNode
  onSave: () => void
  onPreview?: () => void
  saving?: boolean
}

export default function SectionEditor({
  title,
  kicker = 'Edit Content',
  description,
  children,
  onSave,
  onPreview,
  saving = false,
}: SectionEditorProps) {
  return (
    <div className="min-h-full p-5 md:p-6">
      <AdminPageHeader kicker={kicker} title={title} description={description}>
        {onPreview && (
          <AdminButton variant="secondary" onClick={onPreview} disabled={saving}>
            预览
          </AdminButton>
        )}
        <AdminButton variant="primary" onClick={onSave} loading={saving}>
          保存
        </AdminButton>
      </AdminPageHeader>

      <AdminPanel padding="md">
        <div className="space-y-4">{children}</div>
      </AdminPanel>
    </div>
  )
}
