'use client'

import { useState, useEffect } from 'react'
import { useConfig } from '../hooks/useConfig'
import SectionEditor from '../components/SectionEditor'
import FieldEditor from '../components/FieldEditor'
import ListEditor from '../components/ListEditor'

interface ProcessStep {
  number: string
  title: string
  description: string
}

interface ProcessData {
  title: string
  subtitle: string
  steps: ProcessStep[]
}

export default function ProcessPage() {
  const { config, loading, saving, saveConfig } = useConfig()
  const [localData, setLocalData] = useState<ProcessData | null>(null)

  useEffect(() => {
    if (config) {
      setLocalData(structuredClone(config.process as ProcessData))
    }
  }, [config])

  if (loading) return <div className="border border-[#E5E5E0] bg-white p-10 text-center text-sm text-[#737373]">加载中...</div>
  if (!config || !localData) return <div className="border border-[#E5E5E0] bg-white p-10 text-center text-sm text-red-600">加载失败，请刷新重试</div>

  const updateField = (key: keyof ProcessData, value: string) => {
    setLocalData(prev => prev ? { ...prev, [key]: value } : prev)
  }

  const updateSteps = (steps: ProcessStep[]) => {
    setLocalData(prev => prev ? { ...prev, steps } : prev)
  }

  const handleSave = () => {
    saveConfig({ ...config, process: localData })
  }

  return (
    <SectionEditor title="工作流程管理" onSave={handleSave} saving={saving}>
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
        <label className="block text-sm font-semibold text-[#0F1C1A]">步骤列表</label>
        <ListEditor
          items={localData.steps}
          onChange={updateSteps}
          addItem={() => ({ number: '', title: '', description: '' })}
          itemLabel="步骤"
          renderItem={(item, _index, onChange) => (
            <div className="space-y-3 pr-20">
              <div className="flex gap-3">
                <div className="w-24">
                  <FieldEditor
                    label="编号"
                    value={item.number}
                    onChange={(v) => onChange({ ...item, number: v })}
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
