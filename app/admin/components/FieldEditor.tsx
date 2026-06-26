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

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

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

  const baseInputClasses = `w-full border bg-white px-4 py-3 text-sm text-[#0F1C1A]
    placeholder:text-[#737373]/60 transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-[#B08D57]/30 focus:border-[#B08D57]
    ${urlError ? 'border-red-400' : 'border-[#E5E5E0]'}`

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-[#0F1C1A]">
        {label}
        {required && <span className="ml-0.5 text-[#B08D57]">*</span>}
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

      {urlError && <p className="text-xs text-red-500">{urlError}</p>}
    </div>
  )
}
