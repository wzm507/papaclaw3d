'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { NewsArticle, NewsCrawlLog } from '../../lib/news-types'
import type { SeoTopic } from '../../lib/seo-topics'

interface NewsApiItem extends Omit<NewsArticle, 'contentText'> {
  contentLength: number
}

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsApiItem[]>([])
  const [logs, setLogs] = useState<NewsCrawlLog[]>([])
  const [topics, setTopics] = useState<SeoTopic[]>([])
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    title: '',
    sourceName: '',
    sourceUrl: '',
    publishedAt: '',
    categorySlug: 'ai-global-expansion',
    contentText: '',
  })

  const categoryOptions = useMemo(
    () => [{ slug: '', title: '全部新闻' }, ...topics.map((topic) => ({ slug: topic.slug, title: topic.title }))],
    [topics]
  )

  const loadData = async (nextCategory = category) => {
    setLoading(true)
    try {
      const [newsRes, topicsRes] = await Promise.all([
        fetch(`/api/news${nextCategory ? `?category=${nextCategory}` : ''}`, { cache: 'no-store' }),
        fetch('/api/seo-topics', { cache: 'no-store' }),
      ])
      const newsJson = await newsRes.json()
      const topicsJson = await topicsRes.json()
      setArticles(newsJson.data || [])
      setLogs(newsJson.logs || [])
      setTopics(Array.isArray(topicsJson) ? topicsJson : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    loadData(value)
  }

  const handleManualSubmit = async () => {
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/news/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '保存失败')

      setMessage('手动新闻已发布，并已触发 IndexNow。')
      setForm({
        title: '',
        sourceName: '',
        sourceUrl: '',
        publishedAt: '',
        categorySlug: form.categorySlug,
        contentText: '',
      })
      await loadData(category)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    setMessage('')
    try {
      const res = await fetch('/api/news/sync', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '同步失败')
      setMessage(`同步完成：候选 ${data.fetched || 0} 条，发布 ${data.published || 0} 条，失败 ${data.failed || 0} 条。`)
      await loadData(category)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '同步失败')
    } finally {
      setSyncing(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!window.confirm('确认删除这条新闻？')) return
    await fetch(`/api/news?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' })
    await loadData(category)
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8 border-b border-ash-whisper pb-8">
        <p className="kicker mb-3">News CMS</p>
        <h1 className="font-sans text-[clamp(2rem,4vw,4rem)] font-semibold leading-none text-deep-forest">
          真实新闻管理
        </h1>
        <p className="mt-4 max-w-3xl font-sans text-base leading-relaxed text-slate-tint">
          新闻按 7 个 SEO 专题分类展示。自动抓取必须拿到全文才会发布；抓不到全文的内容会进入失败记录。
        </p>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <select
          value={category}
          onChange={(event) => handleCategoryChange(event.target.value)}
          className="min-h-11 rounded-content border border-ash-whisper bg-paper-white px-4 font-sans text-sm text-deep-forest"
        >
          {categoryOptions.map((item) => (
            <option key={item.slug || 'all'} value={item.slug}>
              {item.title}
            </option>
          ))}
        </select>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="inline-flex min-h-11 items-center rounded-content border border-deep-forest bg-deep-forest px-5 font-sans text-sm font-semibold text-white transition-colors hover:border-foudre-pink hover:bg-foudre-pink disabled:opacity-50"
        >
          {syncing ? '同步中...' : '立即抓取新闻'}
        </button>
        <Link
          href="/admin/news-sources"
          className="inline-flex min-h-11 items-center rounded-content border border-deep-forest bg-paper-white px-5 font-sans text-sm font-semibold text-deep-forest"
        >
          管理新闻源
        </Link>
        {message && <span className="font-sans text-sm font-semibold text-foudre-pink">{message}</span>}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_28rem]">
        <section className="rounded-content border border-ash-whisper bg-paper-white p-5 md:p-6">
          <h2 className="font-sans text-xl font-semibold text-deep-forest">已发布新闻</h2>
          <div className="mt-5 space-y-3">
            {loading ? (
              <p className="font-sans text-sm text-slate-tint">加载中...</p>
            ) : articles.length > 0 ? (
              articles.map((article) => (
                <div key={article.id} className="rounded-content border border-ash-whisper p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="font-sans text-xs font-semibold uppercase text-foudre-pink">
                        {article.categoryName} · {article.sourceName}
                      </p>
                      <h3 className="mt-2 font-sans text-lg font-semibold leading-snug text-deep-forest">
                        {article.searchableTitle || article.title}
                      </h3>
                      <p className="mt-2 font-sans text-sm leading-relaxed text-slate-tint">
                        正文 {article.contentLength} 字符 · 状态 {article.crawlStatus}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/news/${article.slug}`}
                        target="_blank"
                        className="rounded-content border border-ash-whisper px-3 py-2 font-sans text-xs font-semibold text-deep-forest"
                      >
                        查看
                      </Link>
                      <button
                        onClick={() => handleDelete(article.slug)}
                        className="rounded-content border border-red-200 px-3 py-2 font-sans text-xs font-semibold text-red-600"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="font-sans text-sm text-slate-tint">当前分类暂无新闻。</p>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-content border border-ash-whisper bg-paper-white p-5 md:p-6">
            <h2 className="font-sans text-xl font-semibold text-deep-forest">手动新增新闻</h2>
            <div className="mt-5 space-y-3">
              <input
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="新闻标题"
                className="min-h-11 w-full rounded-content border border-ash-whisper px-4 font-sans text-sm"
              />
              <input
                value={form.sourceName}
                onChange={(event) => setForm({ ...form, sourceName: event.target.value })}
                placeholder="来源名称，例如 36氪"
                className="min-h-11 w-full rounded-content border border-ash-whisper px-4 font-sans text-sm"
              />
              <input
                value={form.sourceUrl}
                onChange={(event) => setForm({ ...form, sourceUrl: event.target.value })}
                placeholder="原文链接"
                className="min-h-11 w-full rounded-content border border-ash-whisper px-4 font-sans text-sm"
              />
              <input
                type="date"
                value={form.publishedAt}
                onChange={(event) => setForm({ ...form, publishedAt: event.target.value })}
                className="min-h-11 w-full rounded-content border border-ash-whisper px-4 font-sans text-sm"
              />
              <select
                value={form.categorySlug}
                onChange={(event) => setForm({ ...form, categorySlug: event.target.value })}
                className="min-h-11 w-full rounded-content border border-ash-whisper px-4 font-sans text-sm"
              >
                {topics.map((topic) => (
                  <option key={topic.slug} value={topic.slug}>
                    {topic.title}
                  </option>
                ))}
              </select>
              <textarea
                value={form.contentText}
                onChange={(event) => setForm({ ...form, contentText: event.target.value })}
                placeholder="粘贴新闻全文。建议保留来源事实，不添加未经确认的数据。"
                rows={10}
                className="w-full rounded-content border border-ash-whisper p-4 font-sans text-sm leading-relaxed"
              />
              <button
                onClick={handleManualSubmit}
                disabled={saving}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-content border border-deep-forest bg-deep-forest px-5 font-sans text-sm font-semibold text-white disabled:opacity-50"
              >
                {saving ? '发布中...' : '发布到官网新闻'}
              </button>
            </div>
          </section>

          <section className="rounded-content border border-ash-whisper bg-paper-white p-5 md:p-6">
            <h2 className="font-sans text-xl font-semibold text-deep-forest">最近抓取记录</h2>
            <div className="mt-5 space-y-3">
              {logs.slice(0, 8).map((log) => (
                <div key={log.id} className="rounded-content border border-ash-whisper p-3">
                  <p className={`font-sans text-xs font-semibold ${log.status === 'failed' ? 'text-red-600' : 'text-green-700'}`}>
                    {log.status} · {log.sourceName}
                  </p>
                  <p className="mt-1 line-clamp-2 font-sans text-sm text-deep-forest">{log.title || log.url}</p>
                  <p className="mt-1 font-sans text-xs text-slate-tint">{log.message}</p>
                </div>
              ))}
              {logs.length === 0 && <p className="font-sans text-sm text-slate-tint">暂无抓取记录。</p>}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
