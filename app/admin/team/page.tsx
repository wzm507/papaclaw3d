'use client'

import { useState, useEffect } from 'react'
import { useConfig } from '../hooks/useConfig'
import SectionEditor from '../components/SectionEditor'
import FieldEditor from '../components/FieldEditor'
import ListEditor from '../components/ListEditor'
import ImageUploader from '../components/ImageUploader'

interface TeamMember {
  name: string
  image: string
}

interface TeamData {
  title: string
  members: TeamMember[]
}

export default function TeamPage() {
  const { config, loading, saving, saveConfig } = useConfig()
  const [localData, setLocalData] = useState<TeamData | null>(null)

  useEffect(() => {
    if (config) {
      setLocalData(structuredClone(config.team as TeamData))
    }
  }, [config])

  if (loading) return <div className="border border-[#E5E5E0] bg-white p-10 text-center text-sm text-[#737373]">加载中...</div>
  if (!config || !localData) return <div className="border border-[#E5E5E0] bg-white p-10 text-center text-sm text-red-600">加载失败，请刷新重试</div>

  const updateField = (key: keyof TeamData, value: string) => {
    setLocalData(prev => prev ? { ...prev, [key]: value } : prev)
  }

  const updateMembers = (members: TeamMember[]) => {
    setLocalData(prev => prev ? { ...prev, members } : prev)
  }

  const handleSave = () => {
    saveConfig({ ...config, team: localData })
  }

  return (
    <SectionEditor title="团队管理" onSave={handleSave} saving={saving}>
      <FieldEditor
        label="区域标题"
        value={localData.title}
        onChange={(v) => updateField('title', v)}
        required
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-[#0F1C1A]">团队成员列表</label>
        <ListEditor
          items={localData.members}
          onChange={updateMembers}
          addItem={() => ({ name: '', image: '' })}
          itemLabel="成员"
          renderItem={(item, _index, onChange) => (
            <div className="space-y-3 pr-20">
              <FieldEditor
                label="姓名"
                value={item.name}
                onChange={(v) => onChange({ ...item, name: v })}
                required
              />
              <ImageUploader
                label="头像"
                value={item.image}
                onChange={(v) => onChange({ ...item, image: v })}
              />
            </div>
          )}
        />
      </div>
    </SectionEditor>
  )
}
