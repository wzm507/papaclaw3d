'use client'

import { useId, useState } from 'react'

interface FieldOption {
  value: string
  label: string
}

interface FieldEditorProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'textarea' | 'url' | 'emoji' | 'icon' | 'select' | 'date' | 'tags' | 'lines'
  placeholder?: string
  required?: boolean
  helpText?: string
  maxLength?: number
  options?: FieldOption[]
}

export default function FieldEditor({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  helpText,
  maxLength,
  options = [],
}: FieldEditorProps) {
  const id = useId()
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

  const baseInputClasses = `w-full border bg-white px-3 py-2.5 text-sm text-[#0F1C1A]
    placeholder:text-[#737373]/60 transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-[#B08D57]/30 focus:border-[#B08D57]
    ${urlError ? 'border-red-400' : 'border-[#E5E5E0]'}`

  const counter =
    maxLength !== undefined ? (
      <span className="text-xs text-[#737373]">
        {value.length}/{maxLength}
      </span>
    ) : null

  const renderInput = () => {
    switch (type) {
      case 'textarea':
      case 'lines':
        return (
          <textarea
            id={id}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            maxLength={maxLength}
            rows={type === 'lines' ? 5 : 4}
            className={`${baseInputClasses} min-h-[96px] resize-y leading-relaxed`}
            aria-describedby={helpText || urlError ? `${id}-hint` : undefined}
          />
        )
      case 'select':
        return (
          <select
            id={id}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            required={required}
            className={baseInputClasses}
            aria-describedby={helpText ? `${id}-hint` : undefined}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      case 'date':
        return (
          <input
            id={id}
            type="date"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            required={required}
            className={baseInputClasses}
            aria-describedby={helpText ? `${id}-hint` : undefined}
          />
        )
      case 'tags':
        return (
          <div>
            <input
              id={id}
              type="text"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={placeholder}
              required={required}
              maxLength={maxLength}
              className={baseInputClasses}
              aria-describedby={helpText ? `${id}-hint` : undefined}
            />
            {value && (
              <div className="mt-2 flex flex-wrap gap-2">
                {value
                  .split(/[,，]/)
                  .map((item) => item.trim())
                  .filter(Boolean)
                  .map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center border border-[#E5E5E0] bg-[#F7F7F5] px-2 py-0.5 text-xs font-semibold text-[#0F1C1A]"
                    >
                      {item}
                    </span>
                  ))}
              </div>
            )}
          </div>
        )
      case 'emoji':
      case 'icon':
        return (
          <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            maxLength={type === 'emoji' ? 10 : maxLength}
            className={`${baseInputClasses} w-24 text-center text-lg`}
            aria-describedby={helpText ? `${id}-hint` : undefined}
          />
        )
      default:
        return (
          <input
            id={id}
            type={type === 'url' ? 'url' : 'text'}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            maxLength={maxLength}
            className={baseInputClasses}
            aria-describedby={helpText || urlError ? `${id}-hint` : undefined}
          />
        )
    }
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-[#0F1C1A]">
        {label}
        {required && <span className="ml-0.5 text-[#B08D57]">*</span>}
      </label>

      {renderInput()}

      <div id={`${id}-hint`} className="flex items-center justify-between gap-2">
        {(helpText || urlError) && (
          <p className={`text-xs ${urlError ? 'text-red-500' : 'text-[#737373]'}`}>
            {urlError || helpText}
          </p>
        )}
        {counter && !helpText && !urlError && <span />}
        {counter}
      </div>
    </div>
  )
}
