'use client'

import { useState, useRef } from 'react'
import ImagePreview from './ImagePreview'

interface ImageUploaderProps {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}

export default function ImageUploader({
  label,
  value,
  onChange,
  required = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'url' | 'upload'>(value ? (value.startsWith('/uploads/') ? 'upload' : 'url') : 'url')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '上传失败')
        return
      }

      onChange(data.url)
    } catch {
      setError('上传失败，请重试')
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-[#0F1C1A]">
        {label}
        {required && <span className="ml-0.5 text-[#B08D57]">*</span>}
      </label>

      {/* Mode Toggle */}
      <div className="flex gap-1 mb-2">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-3 py-1 text-xs font-semibold transition-colors ${
            mode === 'url'
              ? 'bg-[#0F1C1A] text-white'
              : 'bg-[#E5E5E0] text-[#0F1C1A]/70 hover:bg-[#0F1C1A]/10'
          }`}
        >
          URL 链接
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-3 py-1 text-xs font-semibold transition-colors ${
            mode === 'upload'
              ? 'bg-[#0F1C1A] text-white'
              : 'bg-[#E5E5E0] text-[#0F1C1A]/70 hover:bg-[#0F1C1A]/10'
          }`}
        >
          本地上传
        </button>
      </div>

      <div className="flex items-start gap-3">
        {mode === 'url' ? (
          <div className="flex-1">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
              required={required}
              className="w-full border border-[#E5E5E0] bg-white px-3 py-2 text-sm text-[#0F1C1A]
                placeholder:text-[#737373]/60 transition-all duration-200
                focus:border-[#B08D57] focus:outline-none focus:ring-2 focus:ring-[#B08D57]/30"
            />
          </div>
        ) : (
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
              onChange={handleFileUpload}
              disabled={uploading}
              className="w-full text-sm text-[#0F1C1A]
                file:mr-3 file:border-0 file:bg-[#B08D57]/10 file:px-4 file:py-2
                file:text-sm file:font-semibold file:text-[#B08D57]
                hover:file:bg-[#B08D57]/20
                file:cursor-pointer file:transition-colors
                disabled:cursor-not-allowed disabled:opacity-50"
            />
            {value && value.startsWith('/uploads/') && (
              <p className="mt-1 text-xs text-[#737373]">已上传: {value}</p>
            )}
          </div>
        )}

        <ImagePreview url={value} />
      </div>

      {uploading && (
        <p className="text-xs text-[#B08D57]">上传中...</p>
      )}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
