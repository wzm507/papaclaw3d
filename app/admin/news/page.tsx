'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { NewsArticle, NewsCrawlLog } from '../../lib/news-types'
import type { SeoTopic } from '../../lib/seo-topics'
import AdminPageHeader from '../components/AdminPageHeader'
import AdminButton from '../components/AdminButton'
import Toolbar from '../components/Toolbar'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import FieldEditor from '../components/FieldEditor'
import AdminLoading from '../components/AdminLoading'
import AdminError from '../components/AdminError'
import ConfirmDialog from '../components/ConfirmDialog'

interface NewsApiItem extends Omit<NewsArticle, 'contentText'> {
  contentLength: number
}

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsApiItem[]>([])
  const [logs, setLogs] = useState<NewsCrawlLog[]>([])
  const [topics, setTopics] = useState<SeoTopic[]>([])
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [keywordSyncing, setKeywordSyncing] = useState(false)
  const [reclassifying, setReclassifying] = useState(false)
  const [keywordsInput, setKeywordsInput] = useState('')
  const [message, setMessage] = useState('')
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    sourceName: '',
    sourceUrl: '',
    publishedAt: '',
    categorySlug: 'ai-global-expansion',
    contentText: '',
  })

  const categoryOptions = useMemo(
    () => topics.map((topic) => ({ value: topic.slug, label: topic.title })),
    [topics]
  )

  const loadData = async (nextCategory = category) => {
    setLoading(true)
    setLoadError('')
    try {
      const [newsRes, topicsRes] = await Promise.all([
        fetch(`/api/news${nextCategory ? `?category=${nextCategory}` : ''}`, { cache: 'no-store' }),
        fetch('/api/seo-topics', { cache: 'no-store' }),
      ])
      if (!newsRes.ok) throw new Error('获取新闻失败')
      if (!topicsRes.ok) throw new Error('获取专题失败')
      const newsJson = await newsRes.json()
      const topicsJson = await topicsRes.json()
      setArticles(newsJson.data || [])
      setLogs(newsJson.logs || [])
      setTopics(Array.isArray(topicsJson) ? topicsJson : [])
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : '加载失败')
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
    await fetch(`/api/news?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' })
    setDeleteSlug(null)
    await loadData(category)
  }

  const handleKeywordSync = async () => {
    const keywords = keywordsInput
      .split(/[,，\n]/)
      .map((k) => k.trim())
      .filter(Boolean)

    if (keywords.length === 0) {
      setMessage('请先输入关键词，多个关键词用逗号或换行分隔')
      return
    }

    setKeywordSyncing(true)
    setMessage('')
    try {
      const res = await fetch('/api/news/fetch-by-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords, maxResults: 10, fetchFullText: false }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '抓取失败')
      setMessage(
        `关键词抓取完成：候选 ${data.fetched || 0} 条，发布 ${data.published || 0} 条，失败 ${data.failures || 0} 条。`
      )
      setKeywordsInput('')
      await loadData(category)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '抓取失败')
    } finally {
      setKeywordSyncing(false)
    }
  }

  const handleReclassify = async () => {
    setReclassifying(true)
    setMessage('')
    try {
      const res = await fetch('/api/news/reclassify', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '重新分类失败')
      setMessage(`重新分类完成：共 ${data.total} 条，更新 ${data.changed} 条。`)
      await loadData(category)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '重新分类失败')
    } finally {
      setReclassifying(false)
    }
  }

  if (loading && articles.length === 0 && logs.length === 0) return <AdminLoading />
  if (loadError) return <AdminError text={loadError} onRetry={() => loadData(category)} />

  return (
    <div className="p-5 md:p-6">
      <AdminPageHeader
        kicker="News CMS"
        title="真实新闻管理"
        description="新闻按 7 个 SEO 专题分类展示。自动抓取必须拿到全文才会发布；抓不到全文的内容会进入失败记录。"
      >
        <AdminButton variant="secondary" size="sm" asChild>
          <Link href="/admin/news-sources">管理新闻源</Link>
        </AdminButton>
        <AdminButton variant="primary" size="sm" onClick={handleSync} loading={syncing}>
          立即抓取
        </AdminButton>
      </AdminPageHeader>

      {message && (
        <div className="mb-5 border border-[#B08D57]/30 bg-white px-4 py-3 text-sm font-semibold text-[#0F1C1A]">
          {message}
        </div>
      )}

      <section className="mb-5 grid gap-4 border border-[#E5E5E0] bg-white p-4 md:grid-cols-[1fr_auto_auto]">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#737373]">
            按关键词抓取真实热点新闻
          </label>
          <input
            value={keywordsInput}
            onChange={(event) => setKeywordsInput(event.target.value)}
            placeholder="例如：企业出海，中东，AI出海（多个关键词用逗号分隔）"
            className="min-h-10 w-full border border-[#E5E5E0] px-3 text-sm text-[#0F1C1A] placeholder:text-[#737373]/60 transition-all focus:border-[#B08D57] focus:outline-none focus:ring-2 focus:ring-[#B08D57]/30"
          />
        </div>
        <AdminButton
          variant="primary"
          className="self-end"
          onClick={handleKeywordSync}
          loading={keywordSyncing}
        >
          按关键词抓取
        </AdminButton>
        <AdminButton
          variant="secondary"
          className="self-end"
          onClick={handleReclassify}
          loading={reclassifying}
        >
          重新分类
        </AdminButton>
      </section>

      <Toolbar className="mb-5">
        <div className="w-48">
          <FieldEditor
            label=""
            value={category}
            onChange={handleCategoryChange}
            type="select"
            options={[{ value: '', label: '全部新闻' }, ...categoryOptions]}
          />
        </div>
      </Toolbar>

      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#737373]">
              已发布新闻
            </h2>
            <span className="text-xs text-[#737373]">共 {articles.length} 条</span>
          </div>
          <DataTable
            columns={[
              { key: 'title', label: '标题', className: 'min-w-[16rem]' },
              { key: 'categoryName', label: '分类' },
              { key: 'sourceName', label: '来源' },
              {
                key: 'status',
                label: '状态',
                render: (item) => (
                  <StatusBadge variant={item.crawlStatus === 'published' ? 'success' : 'default'}>
                    {item.crawlStatus}
                  </StatusBadge>
                ),
              },
              { key: 'contentLength', label: '字数', render: (item) => `${item.contentLength}` },
              {
                key: 'actions',
                label: '操作',
                className: 'w-32',
                render: (item) => (
                  <div className="flex gap-2">
                    <Link
                      href={`/news/${item.slug}`}
                      target="_blank"
                      className="inline-flex h-8 items-center border border-[#E5E5E0] px-2 text-xs font-semibold text-[#0F1C1A] transition-colors hover:border-[#0F1C1A]"
                    >
                      查看
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteSlug(item.slug)}
                      className="inline-flex h-8 items-center border border-red-200 px-2 text-xs font-semibold text-red-600 transition-colors hover:border-red-500 hover:bg-red-50"
                    >
                      删除
                    </button>
                  </div>
                ),
              },
            ]}
            data={articles}
            keyExtractor={(item) => item.id}
            emptyText="当前分类暂无新闻。"
          />
        </section>

        <aside className="space-y-5">
          <section className="border border-[#E5E5E0] bg-white p-4">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#737373]">
              手动新增新闻
            </h2>
            <div className="space-y-3">
              <FieldEditor
                label="标题"
                value={form.title}
                onChange={(v) => setForm({ ...form, title: v })}
                required
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <FieldEditor
                  label="来源名称"
                  value={form.sourceName}
                  onChange={(v) => setForm({ ...form, sourceName: v })}
                  placeholder="例如 36氪"
                />
                <FieldEditor
                  label="发布时间"
                  value={form.publishedAt}
                  onChange={(v) => setForm({ ...form, publishedAt: v })}
                  type="date"
                />
              </div>
              <FieldEditor
                label="原文链接"
                value={form.sourceUrl}
                onChange={(v) => setForm({ ...form, sourceUrl: v })}
                type="url"
              />
              <FieldEditor
                label="分类"
                value={form.categorySlug}
                onChange={(v) => setForm({ ...form, categorySlug: v })}
                type="select"
                options={categoryOptions}
              />
              <FieldEditor
                label="正文"
                value={form.contentText}
                onChange={(v) => setForm({ ...form, contentText: v })}
                type="textarea"
                placeholder="粘贴新闻全文。建议保留来源事实，不添加未经确认的数据。"
                rows={6}
              />
              <AdminButton
                variant="primary"
                className="w-full"
                onClick={handleManualSubmit}
                loading={saving}
              >
                发布到官网
              </AdminButton>
            </div>
          </section>

          <section className="border border-[#E5E5E0] bg-white p-4">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#737373]">
              最近抓取记录
            </h2>
            <div className="space-y-2">
              {logs.slice(0, 8).map((log) => (
                <div key={log.id} className="border border-[#E5E5E0] p-3">
                  <div className="flex items-center gap-2">
                    <StatusBadge variant={log.status === 'failed' ? 'error' : 'default'}>
                      {log.status}
                    </StatusBadge>
                    <span className="text-xs font-semibold text-[#737373]">{log.sourceName}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-[#0F1C1A]">{log.title || log.url}</p>
                  <p className="mt-1 text-xs text-[#737373]">{log.message}</p>
                </div>
              ))}
              {logs.length === 0 && <p className="text-sm text-[#737373]">暂无抓取记录。</p>}
            </div>
          </section>
        </aside>
      </div>

      <ConfirmDialog
        open={deleteSlug !== null}
        title="确认删除"
        description="确定要删除这条新闻吗？删除后无法恢复。"
        confirmText="删除"
        cancelText="取消"
        variant="danger"
        onConfirm={() => deleteSlug && handleDelete(deleteSlug)}
        onCancel={() => setDeleteSlug(null)}
      />
    </div>
  )
}
