'use client'

import { useState, useEffect } from 'react'
import { useConfig } from '../hooks/useConfig'
import SectionEditor from '../components/SectionEditor'
import FieldEditor from '../components/FieldEditor'
import ListEditor from '../components/ListEditor'
import AdminLoading from '../components/AdminLoading'
import AdminError from '../components/AdminError'

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
  const { config, loading, saving, saveConfig, refetch } = useConfig()
  const [localData, setLocalData] = useState<WhyData | null>(null)

  useEffect(() => {
    if (config) {
      setLocalData(structuredClone(config.why as WhyData))
    }
  }, [config])

  if (loading) return <AdminLoading />
  if (!config || !localData) return <AdminError text="加载失败，请刷新重试" onRetry={refetch} />

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
    <SectionEditor title="优势理由管理" kicker="Why Us" onSave={handleSave} saving={saving}>
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
        <label className="block text-sm font-semibold text-[#0F1C1A]">理由列表</label>
        <ListEditor
          items={localData.reasons}
          onChange={updateReasons}
          addItem={() => ({ title: '', description: '' })}
          itemLabel="理由"
          renderItem={(item, _index, onChange) => (
            <div className="space-y-3">
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
