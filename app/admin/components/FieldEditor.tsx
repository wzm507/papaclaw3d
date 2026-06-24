'use client'

import { useState } from 'react'

interface FieldEditorProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'textarea' | 'url' | 'emoji'
  placeholder?: string
  required?: boolean
}

export default function FieldEditor({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
}: FieldEditorProps) {
  const [urlError, setUrlError] = useState('')

  const handleChange = (newValue: string) => {
    if (type === 'url') {
      if (newValue && !isValidUrl(newValue)) {
        setUrlError('请输入有效的 URL 地址')
      } else {
        setUrlError('')
      }
    }
    onChange(newValue)
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const baseInputClasses = `w-full rounded-content border bg-paper-white px-4 py-3 font-utility text-sm text-deep-forest
    placeholder:text-slate-tint/60 transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-foudre-pink/30 focus:border-foudre-pink
    ${urlError ? 'border-red-400' : 'border-ash-whisper'}`

  return (
    <div className="space-y-2">
      <label className="block font-utility text-sm font-semibold text-deep-forest">
        {label}
        {required && <span className="text-foudre-pink ml-0.5">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={4}
          className={`${baseInputClasses} min-h-[112px] resize-y leading-relaxed`}
        />
      ) : (
        <input
          type={type === 'url' ? 'url' : 'text'}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          maxLength={type === 'emoji' ? 10 : undefined}
          className={`${baseInputClasses} ${type === 'emoji' ? 'w-24 text-center text-lg' : ''}`}
        />
      )}

      {urlError && <p className="font-utility text-xs text-red-500">{urlError}</p>}
    </div>
  )
}
