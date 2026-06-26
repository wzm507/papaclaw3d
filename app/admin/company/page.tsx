'use client'

import { useState, useEffect } from 'react'
import { useConfig } from '../hooks/useConfig'
import SectionEditor from '../components/SectionEditor'
import FieldEditor from '../components/FieldEditor'
import ListEditor from '../components/ListEditor'
import AdminLoading from '../components/AdminLoading'
import AdminError from '../components/AdminError'

interface SocialLink {
  platform: string
  url: string
}

interface CompanyData {
  name: string
  tagline: string
  description: string
  whatsappUrl: string
  socialLinks: Record<string, string>
  menuItems: string[]
}

export default function CompanyPage() {
  const { config, loading, saving, saveConfig, refetch } = useConfig()
  const [localData, setLocalData] = useState<CompanyData | null>(null)

  useEffect(() => {
    if (config) {
      const companyData = structuredClone(config.company as CompanyData)
      companyData.menuItems = (config.header as any)?.menuItems || []
      setLocalData(companyData)
    }
  }, [config])

  if (loading) return <AdminLoading />
  if (!config || !localData) return <AdminError text="加载失败，请刷新重试" onRetry={refetch} />

  const updateField = (key: keyof CompanyData, value: string) => {
    setLocalData(prev => prev ? { ...prev, [key]: value } : prev)
  }

  const updateMenuItems = (items: string[]) => {
    setLocalData(prev => prev ? { ...prev, menuItems: items } : prev)
  }

  const socialLinksArray: SocialLink[] = Object.entries(localData.socialLinks || {}).map(
    ([platform, url]) => ({ platform, url })
  )

  const updateSocialLinks = (links: SocialLink[]) => {
    const socialLinks: Record<string, string> = {}
    links.forEach(link => {
      if (link.platform) socialLinks[link.platform] = link.url
    })
    setLocalData(prev => prev ? { ...prev, socialLinks } : prev)
  }

  const handleSave = () => {
    const { menuItems, ...companyData } = localData
    const header = { whatsappUrl: (config.header as any)?.whatsappUrl || '', menuItems }
    saveConfig({ ...config, company: companyData, header })
  }

  return (
    <SectionEditor title="企业信息配置" kicker="Company" onSave={handleSave} saving={saving}>
      <FieldEditor
        label="企业名称"
        value={localData.name}
        onChange={(v) => updateField('name', v)}
        required
      />
      <FieldEditor
        label="企业标语"
        value={localData.tagline}
        onChange={(v) => updateField('tagline', v)}
      />
      <FieldEditor
        label="企业描述"
        value={localData.description}
        onChange={(v) => updateField('description', v)}
        type="textarea"
      />
      <FieldEditor
        label="WhatsApp链接"
        value={localData.whatsappUrl}
        onChange={(v) => updateField('whatsappUrl', v)}
        type="url"
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-[#0F1C1A]">导航菜单项</label>
        <ListEditor
          items={localData.menuItems || []}
          onChange={updateMenuItems}
          addItem={() => ''}
          itemLabel="菜单项"
          renderItem={(item, _index, onChange) => (
            <FieldEditor
              label="菜单名称"
              value={item}
              onChange={(v) => onChange(v)}
              required
            />
          )}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-[#0F1C1A]">社交媒体链接</label>
        <ListEditor
          items={socialLinksArray}
          onChange={updateSocialLinks}
          addItem={() => ({ platform: '', url: '' })}
          itemLabel="社交媒体"
          renderItem={(item, _index, onChange) => (
            <div className="flex gap-3">
              <div className="flex-1">
                <FieldEditor
                  label="平台名称"
                  value={item.platform}
                  onChange={(v) => onChange({ ...item, platform: v })}
                  helpText="如 WeChat、LinkedIn"
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
    </SectionEditor>
  )
}
