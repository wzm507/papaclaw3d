'use client'

import { useEffect, useState } from 'react'
import SectionEditor from '../components/SectionEditor'
import FieldEditor from '../components/FieldEditor'
import ListEditor from '../components/ListEditor'

interface SeoTopicFaq {
  question: string
  answer: string
}

interface SeoTopic {
  slug: string
  title: string
  metaTitle: string
  description: string
  keywords: string[]
  serviceName: string
  audience: string[]
  problems: string[]
  papaClawAdvantages: string[]
  process: string[]
  faq: SeoTopicFaq[]
}

function emptyTopic(): SeoTopic {
  return {
    slug: '',
    title: '',
    metaTitle: '',
    description: '',
    keywords: [],
    serviceName: '',
    audience: [],
    problems: [],
    papaClawAdvantages: [],
    process: [],
    faq: [],
  }
}

function commaText(items: string[]) {
  return items.join(', ')
}

function parseCommaText(value: string) {
  return value
    .split(/[,，]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseLines(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

export default function SeoTopicsAdminPage() {
  const [topics, setTopics] = useState<SeoTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function fetchTopics() {
      setLoading(true)
      try {
        const response = await fetch('/api/seo-topics')
        if (!response.ok) throw new Error('获取SEO专题失败')
        const data = await response.json()
        setTopics(data)
      } catch (error) {
        console.error(error)
        setMessage('获取SEO专题失败，请刷新重试')
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      const response = await fetch('/api/seo-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(topics),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || '保存失败')
      setTopics(data.topics)
      const pushText = data.indexNow?.ok
        ? `已同步推送 ${data.indexNow.submitted} 个 URL 到 IndexNow。`
        : 'IndexNow 会在定时任务中继续推送。'
      setMessage(`SEO专题页已保存。专题页、sitemap、llms 和 IndexNow 会使用最新内容。${pushText}`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="border border-[#E5E5E0] bg-white p-10 text-center text-sm text-[#737373]">加载中...</div>

  return (
    <SectionEditor title="SEO专题页管理" onSave={handleSave} saving={saving}>
      <div className="border border-[#E5E5E0] bg-white p-5 text-sm leading-7 text-[#737373]">
        管理这里会影响：专题页 URL、页面标题、关键词、FAQ、sitemap、llms.txt、llms-full.txt 和 IndexNow 推送。Slug 只能使用小写英文、数字和连字符，例如 <code>ai-global-expansion</code>。
      </div>

      {message && (
        <div className="border border-[#B08D57]/30 bg-white p-5 text-sm font-semibold text-[#0F1C1A]">
          {message}
        </div>
      )}

      <ListEditor
        items={topics}
        onChange={setTopics}
        addItem={emptyTopic}
        itemLabel="SEO专题"
        renderItem={(topic, index, onChange) => (
          <div className="space-y-5 pr-20">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="lg:w-64">
                <FieldEditor
                  label="Slug / URL路径"
                  value={topic.slug}
                  onChange={(value) => onChange({ ...topic, slug: value })}
                  placeholder="ai-global-expansion"
                  required
                />
              </div>
              <div className="flex-1">
                <FieldEditor
                  label="页面主标题"
                  value={topic.title}
                  onChange={(value) => onChange({ ...topic, title: value })}
                  required
                />
              </div>
              <div className="flex-1">
                <FieldEditor
                  label="SEO标题"
                  value={topic.metaTitle}
                  onChange={(value) => onChange({ ...topic, metaTitle: value })}
                  required
                />
              </div>
            </div>

            <FieldEditor
              label="页面描述 / Meta Description"
              value={topic.description}
              onChange={(value) => onChange({ ...topic, description: value })}
              type="textarea"
              required
            />

            <FieldEditor
              label="关键词（英文逗号或中文逗号都请统一用逗号分隔）"
              value={commaText(topic.keywords)}
              onChange={(value) => onChange({ ...topic, keywords: parseCommaText(value) })}
              placeholder="AI科技出海, AI出海服务商"
            />

            <FieldEditor
              label="服务名称"
              value={topic.serviceName}
              onChange={(value) => onChange({ ...topic, serviceName: value })}
              required
            />

            <div className="grid gap-4 lg:grid-cols-2">
              <FieldEditor
                label="服务对象（每行一条）"
                value={topic.audience.join('\n')}
                onChange={(value) => onChange({ ...topic, audience: parseLines(value) })}
                type="textarea"
              />
              <FieldEditor
                label="解决什么问题（每行一条）"
                value={topic.problems.join('\n')}
                onChange={(value) => onChange({ ...topic, problems: parseLines(value) })}
                type="textarea"
              />
              <FieldEditor
                label="Papa Claw为什么能做（每行一条）"
                value={topic.papaClawAdvantages.join('\n')}
                onChange={(value) => onChange({ ...topic, papaClawAdvantages: parseLines(value) })}
                type="textarea"
              />
              <FieldEditor
                label="服务推进路径（每行一条）"
                value={topic.process.join('\n')}
                onChange={(value) => onChange({ ...topic, process: parseLines(value) })}
                type="textarea"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#0F1C1A]">FAQ问答</label>
              <ListEditor
                items={topic.faq}
                onChange={(faq) => onChange({ ...topic, faq })}
                addItem={() => ({ question: '', answer: '' })}
                itemLabel="FAQ"
                renderItem={(faq, _faqIndex, onFaqChange) => (
                  <div className="space-y-3 pr-20">
                    <FieldEditor
                      label="问题"
                      value={faq.question}
                      onChange={(value) => onFaqChange({ ...faq, question: value })}
                      required
                    />
                    <FieldEditor
                      label="回答"
                      value={faq.answer}
                      onChange={(value) => onFaqChange({ ...faq, answer: value })}
                      type="textarea"
                      required
                    />
                  </div>
                )}
              />
            </div>

            <div className="border border-[#E5E5E0] bg-[#F7F7F5] p-3 text-xs text-[#737373]">
              预览地址：/{topic.slug || `new-seo-topic-${index + 1}`}
            </div>
          </div>
        )}
      />
    </SectionEditor>
  )
}
