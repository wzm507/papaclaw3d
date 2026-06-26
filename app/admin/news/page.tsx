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
      <div className="mb-8 border-b border-[#E5E5E0] pb-8">
        <p className="p-kicker mb-3">News CMS</p>
        <h1 className="text-[clamp(2rem,4vw,4rem)] font-semibold leading-none text-[#0F1C1A]">
          真实新闻管理
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#737373]">
          新闻按 7 个 SEO 专题分类展示。自动抓取必须拿到全文才会发布；抓不到全文的内容会进入失败记录。
        </p>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <select
          value={category}
          onChange={(event) => handleCategoryChange(event.target.value)}
          className="min-h-11 border border-[#E5E5E0] bg-white px-4 text-sm text-[#0F1C1A] transition-all focus:border-[#B08D57] focus:outline-none focus:ring-2 focus:ring-[#B08D57]/30"
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
          className="inline-flex min-h-11 items-center border border-[#0F1C1A] bg-[#0F1C1A] px-5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-[#B08D57] hover:bg-[#B08D57] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {syncing ? '同步中...' : '立即抓取新闻'}
        </button>
        <Link
          href="/admin/news-sources"
          className="inline-flex min-h-11 items-center border border-[#0F1C1A] bg-white px-5 text-sm font-semibold text-[#0F1C1A] transition-all hover:-translate-y-0.5 hover:border-[#B08D57] hover:text-[#B08D57]"
        >
          管理新闻源
        </Link>
        {message && <span className="text-sm font-semibold text-[#B08D57]">{message}</span>}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_28rem]">
        <section className="border border-[#E5E5E0] bg-white p-5 md:p-6">
          <h2 className="text-xl font-semibold text-[#0F1C1A]">已发布新闻</h2>
          <div className="mt-5 space-y-3">
            {loading ? (
              <p className="text-sm text-[#737373]">加载中...</p>
            ) : articles.length > 0 ? (
              articles.map((article) => (
                <div key={article.id} className="border border-[#E5E5E0] p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase text-[#B08D57]">
                        {article.categoryName} · {article.sourceName}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold leading-snug text-[#0F1C1A]">
                        {article.searchableTitle || article.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#737373]">
                        正文 {article.contentLength} 字符 · 状态 {article.crawlStatus}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/news/${article.slug}`}
                        target="_blank"
                        className="border border-[#E5E5E0] px-3 py-2 text-xs font-semibold text-[#0F1C1A] transition-colors hover:border-[#0F1C1A]"
                      >
                        查看
                      </Link>
                      <button
                        onClick={() => handleDelete(article.slug)}
                        className="border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:border-red-500"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#737373]">当前分类暂无新闻。</p>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="border border-[#E5E5E0] bg-white p-5 md:p-6">
            <h2 className="text-xl font-semibold text-[#0F1C1A]">手动新增新闻</h2>
            <div className="mt-5 space-y-3">
              <input
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="新闻标题"
                className="min-h-11 w-full border border-[#E5E5E0] px-4 text-sm text-[#0F1C1A] placeholder:text-[#737373]/60 transition-all focus:border-[#B08D57] focus:outline-none focus:ring-2 focus:ring-[#B08D57]/30"
              />
              <input
                value={form.sourceName}
                onChange={(event) => setForm({ ...form, sourceName: event.target.value })}
                placeholder="来源名称，例如 36氪"
                className="min-h-11 w-full border border-[#E5E5E0] px-4 text-sm text-[#0F1C1A] placeholder:text-[#737373]/60 transition-all focus:border-[#B08D57] focus:outline-none focus:ring-2 focus:ring-[#B08D57]/30"
              />
              <input
                value={form.sourceUrl}
                onChange={(event) => setForm({ ...form, sourceUrl: event.target.value })}
                placeholder="原文链接"
                className="min-h-11 w-full border border-[#E5E5E0] px-4 text-sm text-[#0F1C1A] placeholder:text-[#737373]/60 transition-all focus:border-[#B08D57] focus:outline-none focus:ring-2 focus:ring-[#B08D57]/30"
              />
              <input
                type="date"
                value={form.publishedAt}
                onChange={(event) => setForm({ ...form, publishedAt: event.target.value })}
                className="min-h-11 w-full border border-[#E5E5E0] px-4 text-sm text-[#0F1C1A] transition-all focus:border-[#B08D57] focus:outline-none focus:ring-2 focus:ring-[#B08D57]/30"
              />
              <select
                value={form.categorySlug}
                onChange={(event) => setForm({ ...form, categorySlug: event.target.value })}
                className="min-h-11 w-full border border-[#E5E5E0] bg-white px-4 text-sm text-[#0F1C1A] transition-all focus:border-[#B08D57] focus:outline-none focus:ring-2 focus:ring-[#B08D57]/30"
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
                className="w-full border border-[#E5E5E0] p-4 text-sm leading-relaxed text-[#0F1C1A] placeholder:text-[#737373]/60 transition-all focus:border-[#B08D57] focus:outline-none focus:ring-2 focus:ring-[#B08D57]/30"
              />
              <button
                onClick={handleManualSubmit}
                disabled={saving}
                className="inline-flex min-h-11 w-full items-center justify-center border border-[#0F1C1A] bg-[#0F1C1A] px-5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-[#B08D57] hover:bg-[#B08D57] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? '发布中...' : '发布到官网新闻'}
              </button>
            </div>
          </section>

          <section className="border border-[#E5E5E0] bg-white p-5 md:p-6">
            <h2 className="text-xl font-semibold text-[#0F1C1A]">最近抓取记录</h2>
            <div className="mt-5 space-y-3">
              {logs.slice(0, 8).map((log) => (
                <div key={log.id} className="border border-[#E5E5E0] p-3">
                  <p className={`text-xs font-semibold ${log.status === 'failed' ? 'text-red-600' : 'text-green-700'}`}>
                    {log.status} · {log.sourceName}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-[#0F1C1A]">{log.title || log.url}</p>
                  <p className="mt-1 text-xs text-[#737373]">{log.message}</p>
                </div>
              ))}
              {logs.length === 0 && <p className="text-sm text-[#737373]">暂无抓取记录。</p>}
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
