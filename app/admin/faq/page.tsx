'use client'

import { useState, useEffect } from 'react'
import { useConfig } from '../hooks/useConfig'
import SectionEditor from '../components/SectionEditor'
import FieldEditor from '../components/FieldEditor'
import ListEditor from '../components/ListEditor'

interface FaqItem {
  question: string
  answer: string
}

interface FaqData {
  title: string
  subtitle: string
  items: FaqItem[]
}

export default function FaqPage() {
  const { config, loading, saving, saveConfig } = useConfig()
  const [localData, setLocalData] = useState<FaqData | null>(null)

  useEffect(() => {
    if (config) {
      setLocalData(structuredClone(config.faq as FaqData))
    }
  }, [config])

  if (loading) return <div className="rounded-card border border-ash-whisper bg-paper-white p-10 text-center font-sans text-sm text-slate-tint">加载中...</div>
  if (!config || !localData) return <div className="rounded-card border border-ash-whisper bg-paper-white p-10 text-center font-sans text-sm text-red-600">加载失败，请刷新重试</div>

  const updateField = (key: keyof FaqData, value: string) => {
    setLocalData(prev => prev ? { ...prev, [key]: value } : prev)
  }

  const updateItems = (items: FaqItem[]) => {
    setLocalData(prev => prev ? { ...prev, items } : prev)
  }

  const handleSave = () => {
    saveConfig({ ...config, faq: localData })
  }

  return (
    <SectionEditor title="FAQ 管理" onSave={handleSave} saving={saving}>
      <FieldEditor
        label="区域标题"
        value={localData.title}
        onChange={(v) => updateField('title', v)}
        required
      />
      <FieldEditor
        label="区域副标题"
        value={localData.subtitle}
        onChange={(v) => updateField('subtitle', v)}
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-deep-forest">问答列表</label>
        <ListEditor
          items={localData.items}
          onChange={updateItems}
          addItem={() => ({ question: '', answer: '' })}
          itemLabel="问答"
          renderItem={(item, _index, onChange) => (
            <div className="space-y-3 pr-20">
              <FieldEditor
                label="问题"
                value={item.question}
                onChange={(v) => onChange({ ...item, question: v })}
                required
              />
              <FieldEditor
                label="回答"
                value={item.answer}
                onChange={(v) => onChange({ ...item, answer: v })}
                type="textarea"
              />
            </div>
          )}
        />
      </div>
    </SectionEditor>
  )
}
