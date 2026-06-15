'use client'

import { useState, useEffect } from 'react'
import { useConfig } from '../hooks/useConfig'
import SectionEditor from '../components/SectionEditor'
import FieldEditor from '../components/FieldEditor'
import ListEditor from '../components/ListEditor'

interface WhyReason {
  title: string
  description: string
}

interface WhyData {
  title: string
  subtitle: string
  reasons: WhyReason[]
}

export default function WhyPage() {
  const { config, loading, saving, saveConfig } = useConfig()
  const [localData, setLocalData] = useState<WhyData | null>(null)

  useEffect(() => {
    if (config) {
      setLocalData(structuredClone(config.why as WhyData))
    }
  }, [config])

  if (loading) return <div className="p-8 text-center">加载中...</div>
  if (!config || !localData) return <div className="p-8 text-center">加载失败</div>

  const updateField = (key: keyof WhyData, value: string) => {
    setLocalData(prev => prev ? { ...prev, [key]: value } : prev)
  }

  const updateReasons = (reasons: WhyReason[]) => {
    setLocalData(prev => prev ? { ...prev, reasons } : prev)
  }

  const handleSave = () => {
    saveConfig({ ...config, why: localData })
  }

  return (
    <SectionEditor title="优势理由管理" onSave={handleSave} saving={saving}>
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
        <label className="block text-sm font-medium text-deep-forest">理由列表</label>
        <ListEditor
          items={localData.reasons}
          onChange={updateReasons}
          addItem={() => ({ title: '', description: '' })}
          itemLabel="理由"
          renderItem={(item, _index, onChange) => (
            <div className="space-y-3 pr-20">
              <FieldEditor
                label="标题"
                value={item.title}
                onChange={(v) => onChange({ ...item, title: v })}
                required
              />
              <FieldEditor
                label="描述"
                value={item.description}
                onChange={(v) => onChange({ ...item, description: v })}
                type="textarea"
              />
            </div>
          )}
        />
      </div>
    </SectionEditor>
  )
}
