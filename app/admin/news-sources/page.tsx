'use client'

import { useEffect, useState } from 'react'
import type { NewsCrawlLog, NewsSource } from '../../lib/news-types'
import type { SeoTopic } from '../../lib/seo-topics'

const emptySource: NewsSource = {
  id: '',
  name: '',
  url: '',
  enabled: true,
  defaultCategorySlug: 'ai-global-expansion',
  keywords: [],
  articleSelector: '',
}

export default function AdminNewsSourcesPage() {
  const [sources, setSources] = useState<NewsSource[]>([])
  const [logs, setLogs] = useState<NewsCrawlLog[]>([])
  const [topics, setTopics] = useState<SeoTopic[]>([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const loadData = async () => {
    const [sourcesRes, topicsRes] = await Promise.all([
      fetch('/api/news-sources', { cache: 'no-store' }),
      fetch('/api/seo-topics', { cache: 'no-store' }),
    ])
    const sourcesJson = await sourcesRes.json()
    const topicsJson = await topicsRes.json()
    setSources(sourcesJson.data || [])
    setLogs(sourcesJson.logs || [])
    setTopics(Array.isArray(topicsJson) ? topicsJson : [])
  }

  useEffect(() => {
    loadData()
  }, [])

  const updateSource = (index: number, patch: Partial<NewsSource>) => {
    setSources((current) => current.map((source, itemIndex) => (itemIndex === index ? { ...source, ...patch } : source)))
  }

  const saveSources = async () => {
    setSaving(true)
    setMessage('')
    try {
      const normalized = sources.map((source, index) => ({
        ...source,
        id: source.id || `source-${index + 1}`,
        keywords: source.keywords.map((keyword) => keyword.trim()).filter(Boolean),
      }))
      const res = await fetch('/api/news-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sources: normalized }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '保存失败')
      setSources(data.data || normalized)
      setMessage('新闻源已保存。')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8 border-b border-ash-whisper pb-8">
        <p className="kicker mb-3">News Sources</p>
        <h1 className="font-sans text-[clamp(2rem,4vw,4rem)] font-semibold leading-none text-deep-forest">
          新闻源管理
        </h1>
        <p className="mt-4 max-w-3xl font-sans text-base leading-relaxed text-slate-tint">
          默认新闻源是公开页面。不同网站会有反爬、登录墙或结构变化；系统会只发布能抓到全文的新闻。
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setSources([...sources, { ...emptySource, id: `source-${Date.now()}` }])}
          className="inline-flex min-h-11 items-center rounded-content border border-deep-forest bg-paper-white px-5 font-sans text-sm font-semibold text-deep-forest"
        >
          新增新闻源
        </button>
        <button
          onClick={saveSources}
          disabled={saving}
          className="inline-flex min-h-11 items-center rounded-content border border-deep-forest bg-deep-forest px-5 font-sans text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? '保存中...' : '保存新闻源'}
        </button>
        {message && <span className="inline-flex min-h-11 items-center font-sans text-sm font-semibold text-foudre-pink">{message}</span>}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
        <section className="space-y-4">
          {sources.map((source, index) => (
            <div key={source.id || index} className="rounded-content border border-ash-whisper bg-paper-white p-5 md:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-2 font-sans text-sm font-semibold text-deep-forest">
                  <input
                    type="checkbox"
                    checked={source.enabled}
                    onChange={(event) => updateSource(index, { enabled: event.target.checked })}
                  />
                  启用新闻源
                </label>
                <button
                  onClick={() => setSources((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  className="font-sans text-sm font-semibold text-red-600"
                >
                  删除
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <input
                  value={source.name}
                  onChange={(event) => updateSource(index, { name: event.target.value })}
                  placeholder="新闻源名称"
                  className="min-h-11 rounded-content border border-ash-whisper px-4 font-sans text-sm"
                />
                <input
                  value={source.id}
                  onChange={(event) => updateSource(index, { id: event.target.value })}
                  placeholder="ID，例如 36kr-global"
                  className="min-h-11 rounded-content border border-ash-whisper px-4 font-sans text-sm"
                />
                <input
                  value={source.url}
                  onChange={(event) => updateSource(index, { url: event.target.value })}
                  placeholder="新闻源 URL"
                  className="min-h-11 rounded-content border border-ash-whisper px-4 font-sans text-sm md:col-span-2"
                />
                <select
                  value={source.defaultCategorySlug}
                  onChange={(event) => updateSource(index, { defaultCategorySlug: event.target.value })}
                  className="min-h-11 rounded-content border border-ash-whisper px-4 font-sans text-sm"
                >
                  {topics.map((topic) => (
                    <option key={topic.slug} value={topic.slug}>
                      {topic.title}
                    </option>
                  ))}
                </select>
                <input
                  value={source.articleSelector || ''}
                  onChange={(event) => updateSource(index, { articleSelector: event.target.value })}
                  placeholder="正文选择器，可选，例如 article-content"
                  className="min-h-11 rounded-content border border-ash-whisper px-4 font-sans text-sm"
                />
                <textarea
                  value={source.keywords.join('\n')}
                  onChange={(event) => updateSource(index, { keywords: event.target.value.split('\n') })}
                  placeholder="关键词，每行一个"
                  rows={5}
                  className="rounded-content border border-ash-whisper p-4 font-sans text-sm md:col-span-2"
                />
              </div>
            </div>
          ))}
        </section>

        <aside className="rounded-content border border-ash-whisper bg-paper-white p-5 md:p-6">
          <h2 className="font-sans text-xl font-semibold text-deep-forest">失败与跳过记录</h2>
          <div className="mt-5 space-y-3">
            {logs.slice(0, 12).map((log) => (
              <div key={log.id} className="rounded-content border border-ash-whisper p-3">
                <p className={`font-sans text-xs font-semibold ${log.status === 'failed' ? 'text-red-600' : 'text-green-700'}`}>
                  {log.status} · {log.sourceName}
                </p>
                <p className="mt-1 line-clamp-2 font-sans text-sm text-deep-forest">{log.title || log.url}</p>
                <p className="mt-1 font-sans text-xs text-slate-tint">{log.message}</p>
              </div>
            ))}
            {logs.length === 0 && <p className="font-sans text-sm text-slate-tint">暂无记录。</p>}
          </div>
        </aside>
      </div>
    </div>
  )
}
