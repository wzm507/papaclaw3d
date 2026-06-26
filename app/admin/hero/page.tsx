'use client'

import { useState, useEffect } from 'react'
import { useConfig } from '../hooks/useConfig'
import SectionEditor from '../components/SectionEditor'
import FieldEditor from '../components/FieldEditor'
import ListEditor from '../components/ListEditor'
import ImageUploader from '../components/ImageUploader'

interface HeroCard {
  image: string
  bubble: string
}

interface HeroData {
  title: string
  subtitle1: string
  subtitle2: string
  backgroundImage: string
  cards: HeroCard[]
}

export default function HeroPage() {
  const { config, loading, saving, saveConfig } = useConfig()
  const [localData, setLocalData] = useState<HeroData | null>(null)

  useEffect(() => {
    if (config) {
      setLocalData(structuredClone(config.hero as HeroData))
    }
  }, [config])

  if (loading) return <div className="rounded-card border border-ash-whisper bg-paper-white p-10 text-center font-sans text-sm text-slate-tint">加载中...</div>
  if (!config || !localData) return <div className="rounded-card border border-ash-whisper bg-paper-white p-10 text-center font-sans text-sm text-red-600">加载失败，请刷新重试</div>

  const updateField = (key: keyof HeroData, value: string) => {
    setLocalData(prev => prev ? { ...prev, [key]: value } : prev)
  }

  const updateCards = (cards: HeroCard[]) => {
    setLocalData(prev => prev ? { ...prev, cards } : prev)
  }

  const handleSave = () => {
    saveConfig({ ...config, hero: localData })
  }

  return (
    <SectionEditor title="首页 Hero 配置" onSave={handleSave} saving={saving}>
      <FieldEditor
        label="主标题"
        value={localData.title}
        onChange={(v) => updateField('title', v)}
        required
      />
      <FieldEditor
        label="副标题1"
        value={localData.subtitle1}
        onChange={(v) => updateField('subtitle1', v)}
      />
      <FieldEditor
        label="副标题2"
        value={localData.subtitle2}
        onChange={(v) => updateField('subtitle2', v)}
      />
      <ImageUploader
        label="背景图片"
        value={localData.backgroundImage}
        onChange={(v) => updateField('backgroundImage', v)}
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-deep-forest">卡片列表</label>
        <ListEditor
          items={localData.cards}
          onChange={updateCards}
          addItem={() => ({ image: '', bubble: '' })}
          itemLabel="卡片"
          renderItem={(item, _index, onChange) => (
            <div className="space-y-3 pr-20">
              <ImageUploader
                label="卡片图片"
                value={item.image}
                onChange={(v) => onChange({ ...item, image: v })}
              />
              <FieldEditor
                label="气泡表情"
                value={item.bubble}
                onChange={(v) => onChange({ ...item, bubble: v })}
                type="emoji"
              />
            </div>
          )}
        />
      </div>
    </SectionEditor>
  )
}
