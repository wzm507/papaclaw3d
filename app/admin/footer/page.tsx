'use client'

import { useState, useEffect } from 'react'
import { useConfig } from '../hooks/useConfig'
import SectionEditor from '../components/SectionEditor'
import FieldEditor from '../components/FieldEditor'
import ListEditor from '../components/ListEditor'

interface SocialLink {
  name: string
  url: string
}

interface LegalLink {
  label: string
  url: string
}

interface FooterData {
  contactTitle: string
  contactDescription: string
  ctaText: string
  socialLinks: SocialLink[]
  copyright: string
  legalLinks: LegalLink[]
  credit: string
}

export default function FooterPage() {
  const { config, loading, saving, saveConfig } = useConfig()
  const [localData, setLocalData] = useState<FooterData | null>(null)

  useEffect(() => {
    if (config) {
      setLocalData(structuredClone(config.footer as FooterData))
    }
  }, [config])

  if (loading) return <div className="rounded-card border border-ash-whisper bg-paper-white p-10 text-center font-sans text-sm text-slate-tint">加载中...</div>
  if (!config || !localData) return <div className="rounded-card border border-ash-whisper bg-paper-white p-10 text-center font-sans text-sm text-red-600">加载失败，请刷新重试</div>

  const updateField = (key: keyof FooterData, value: string) => {
    setLocalData(prev => prev ? { ...prev, [key]: value } : prev)
  }

  const updateSocialLinks = (links: SocialLink[]) => {
    setLocalData(prev => prev ? { ...prev, socialLinks: links } : prev)
  }

  const updateLegalLinks = (links: LegalLink[]) => {
    setLocalData(prev => prev ? { ...prev, legalLinks: links } : prev)
  }

  const handleSave = () => {
    saveConfig({ ...config, footer: localData })
  }

  return (
    <SectionEditor title="页脚配置" onSave={handleSave} saving={saving}>
      <FieldEditor
        label="联系标题"
        value={localData.contactTitle}
        onChange={(v) => updateField('contactTitle', v)}
        required
      />
      <FieldEditor
        label="联系描述"
        value={localData.contactDescription}
        onChange={(v) => updateField('contactDescription', v)}
        type="textarea"
      />
      <FieldEditor
        label="CTA按钮文字"
        value={localData.ctaText}
        onChange={(v) => updateField('ctaText', v)}
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-deep-forest">社交媒体列表</label>
        <ListEditor
          items={localData.socialLinks}
          onChange={updateSocialLinks}
          addItem={() => ({ name: '', url: '' })}
          itemLabel="社交媒体"
          renderItem={(item, _index, onChange) => (
            <div className="flex gap-3 pr-20">
              <div className="flex-1">
                <FieldEditor
                  label="平台名称"
                  value={item.name}
                  onChange={(v) => onChange({ ...item, name: v })}
                />
              </div>
              <div className="flex-1">
                <FieldEditor
                  label="链接"
                  value={item.url}
                  onChange={(v) => onChange({ ...item, url: v })}
                  type="url"
                />
              </div>
            </div>
          )}
        />
      </div>

      <FieldEditor
        label="版权信息"
        value={localData.copyright}
        onChange={(v) => updateField('copyright', v)}
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-deep-forest">法律链接</label>
        <ListEditor
          items={localData.legalLinks}
          onChange={updateLegalLinks}
          addItem={() => ({ label: '', url: '' })}
          itemLabel="法律链接"
          renderItem={(item, _index, onChange) => (
            <div className="flex gap-3 pr-20">
              <div className="flex-1">
                <FieldEditor
                  label="标签"
                  value={item.label}
                  onChange={(v) => onChange({ ...item, label: v })}
                />
              </div>
              <div className="flex-1">
                <FieldEditor
                  label="链接"
                  value={item.url}
                  onChange={(v) => onChange({ ...item, url: v })}
                  type="url"
                />
              </div>
            </div>
          )}
        />
      </div>

      <FieldEditor
        label="署名"
        value={localData.credit}
        onChange={(v) => updateField('credit', v)}
      />
    </SectionEditor>
  )
}
