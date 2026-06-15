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
      <label className="block text-sm font-medium text-deep-forest">
        {label}
        {required && <span className="text-foudre-pink ml-0.5">*</span>}
      </label>

      {/* Mode Toggle */}
      <div className="flex gap-1 mb-2">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-3 py-1 text-xs rounded-md transition-colors ${
            mode === 'url'
              ? 'bg-foudre-pink text-white'
              : 'bg-ash-whisper text-deep-forest/60 hover:bg-ash-whisper/80'
          }`}
        >
          URL 链接
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-3 py-1 text-xs rounded-md transition-colors ${
            mode === 'upload'
              ? 'bg-foudre-pink text-white'
              : 'bg-ash-whisper text-deep-forest/60 hover:bg-ash-whisper/80'
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
              className="w-full px-3 py-2 rounded-lg border border-ash-whisper bg-white text-deep-forest
                placeholder:text-gray-400 text-sm transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-foudre-pink/50 focus:border-foudre-pink"
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
              className="w-full text-sm text-deep-forest
                file:mr-3 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-foudre-pink/10 file:text-foudre-pink
                hover:file:bg-foudre-pink/20
                file:cursor-pointer file:transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {value && value.startsWith('/uploads/') && (
              <p className="text-xs text-deep-forest/50 mt-1">已上传: {value}</p>
            )}
          </div>
        )}

        <ImagePreview url={value} />
      </div>

      {uploading && (
        <p className="text-xs text-foudre-pink">上传中...</p>
      )}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
