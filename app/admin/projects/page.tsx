'use client'

import { useState, useEffect } from 'react'
import { useConfig } from '../hooks/useConfig'
import SectionEditor from '../components/SectionEditor'
import FieldEditor from '../components/FieldEditor'
import ListEditor from '../components/ListEditor'
import ImageUploader from '../components/ImageUploader'

interface ProjectItem {
  id: string
  title: string
  thumbnail: string
  tags: string[]
}

interface ProjectsData {
  title: string
  items: ProjectItem[]
}

export default function ProjectsPage() {
  const { config, loading, saving, saveConfig } = useConfig()
  const [localData, setLocalData] = useState<ProjectsData | null>(null)

  useEffect(() => {
    if (config) {
      setLocalData(structuredClone(config.projects as ProjectsData))
    }
  }, [config])

  if (loading) return <div className="rounded-card border border-ash-whisper bg-paper-white p-10 text-center font-sans text-sm text-slate-tint">加载中...</div>
  if (!config || !localData) return <div className="rounded-card border border-ash-whisper bg-paper-white p-10 text-center font-sans text-sm text-red-600">加载失败，请刷新重试</div>

  const updateField = (key: keyof ProjectsData, value: string) => {
    setLocalData(prev => prev ? { ...prev, [key]: value } : prev)
  }

  const updateItems = (items: ProjectItem[]) => {
    setLocalData(prev => prev ? { ...prev, items } : prev)
  }

  const handleSave = () => {
    saveConfig({ ...config, projects: localData })
  }

  return (
    <SectionEditor title="项目管理" onSave={handleSave} saving={saving}>
      <FieldEditor
        label="区域标题"
        value={localData.title}
        onChange={(v) => updateField('title', v)}
        required
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-deep-forest">项目列表</label>
        <ListEditor
          items={localData.items}
          onChange={updateItems}
          addItem={() => ({ id: '', title: '', thumbnail: '', tags: [] })}
          itemLabel="项目"
          renderItem={(item, _index, onChange) => (
            <div className="space-y-3 pr-20">
              <div className="flex gap-3">
                <div className="w-32">
                  <FieldEditor
                    label="项目ID"
                    value={item.id}
                    onChange={(v) => onChange({ ...item, id: v })}
                    required
                  />
                </div>
                <div className="flex-1">
                  <FieldEditor
                    label="项目名称"
                    value={item.title}
                    onChange={(v) => onChange({ ...item, title: v })}
                    required
                  />
                </div>
              </div>
              <ImageUploader
                label="缩略图"
                value={item.thumbnail}
                onChange={(v) => onChange({ ...item, thumbnail: v })}
              />
              <FieldEditor
                label="标签（逗号分隔）"
                value={item.tags.join(', ')}
                onChange={(v) => onChange({ ...item, tags: v.split(',').map(t => t.trim()).filter(Boolean) })}
              />
            </div>
          )}
        />
      </div>
    </SectionEditor>
  )
}
