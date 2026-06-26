'use client'

import { useState, useEffect } from 'react'
import { useConfig } from '../hooks/useConfig'
import SectionEditor from '../components/SectionEditor'
import FieldEditor from '../components/FieldEditor'
import ListEditor from '../components/ListEditor'

interface ExpertiseItem {
  icon: string
  title: string
  description: string
}

interface ExpertisesData {
  title: string
  subtitle: string
  items: ExpertiseItem[]
}

export default function ExpertisesPage() {
  const { config, loading, saving, saveConfig } = useConfig()
  const [localData, setLocalData] = useState<ExpertisesData | null>(null)

  useEffect(() => {
    if (config) {
      setLocalData(structuredClone(config.expertises as ExpertisesData))
    }
  }, [config])

  if (loading) return <div className="rounded-card border border-ash-whisper bg-paper-white p-10 text-center font-sans text-sm text-slate-tint">加载中...</div>
  if (!config || !localData) return <div className="rounded-card border border-ash-whisper bg-paper-white p-10 text-center font-sans text-sm text-red-600">加载失败，请刷新重试</div>

  const updateField = (key: keyof ExpertisesData, value: string) => {
    setLocalData(prev => prev ? { ...prev, [key]: value } : prev)
  }

  const updateItems = (items: ExpertiseItem[]) => {
    setLocalData(prev => prev ? { ...prev, items } : prev)
  }

  const handleSave = () => {
    saveConfig({ ...config, expertises: localData })
  }

  return (
    <SectionEditor title="专业服务管理" onSave={handleSave} saving={saving}>
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
        <label className="block text-sm font-medium text-deep-forest">服务列表</label>
        <ListEditor
          items={localData.items}
          onChange={updateItems}
          addItem={() => ({ icon: '', title: '', description: '' })}
          itemLabel="服务"
          renderItem={(item, _index, onChange) => (
            <div className="space-y-3 pr-20">
              <div className="flex gap-3">
                <div>
                  <FieldEditor
                    label="图标"
                    value={item.icon}
                    onChange={(v) => onChange({ ...item, icon: v })}
                    type="emoji"
                  />
                </div>
                <div className="flex-1">
                  <FieldEditor
                    label="标题"
                    value={item.title}
                    onChange={(v) => onChange({ ...item, title: v })}
                    required
                  />
                </div>
              </div>
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
