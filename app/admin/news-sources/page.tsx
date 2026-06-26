'use client'

import { useEffect, useMemo, useState } from 'react'
import type { NewsCrawlLog, NewsSource } from '../../lib/news-types'
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
import AdminSearchInput from '../components/AdminSearchInput'
import Pagination from '../components/Pagination'
import AdminMessage from '../components/AdminMessage'
import AdminPanel from '../components/AdminPanel'

const emptySource: NewsSource = {
  id: '',
  name: '',
  url: '',
  enabled: true,
  defaultCategorySlug: 'ai-global-expansion',
  keywords: [],
  articleSelector: '',
}

const PAGE_SIZE = 10

export default function AdminNewsSourcesPage() {
  const [sources, setSources] = useState<NewsSource[]>([])
  const [logs, setLogs] = useState<NewsCrawlLog[]>([])
  const [topics, setTopics] = useState<SeoTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageVariant, setMessageVariant] = useState<'success' | 'error' | 'info'>('info')
  const [search, setSearch] = useState('')
  const [enabledFilter, setEnabledFilter] = useState<'all' | 'enabled' | 'disabled'>('all')
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    setLoadError('')
    try {
      const [sourcesRes, topicsRes] = await Promise.all([
        fetch('/api/news-sources', { cache: 'no-store' }),
        fetch('/api/seo-topics', { cache: 'no-store' }),
      ])
      if (!sourcesRes.ok) throw new Error('获取新闻源失败')
      if (!topicsRes.ok) throw new Error('获取专题失败')
      const sourcesJson = await sourcesRes.json()
      const topicsJson = await topicsRes.json()
      setSources(sourcesJson.data || [])
      setLogs(sourcesJson.logs || [])
      setTopics(Array.isArray(topicsJson) ? topicsJson : [])
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const topicOptions = useMemo(
    () => topics.map((topic) => ({ value: topic.slug, label: topic.title })),
    [topics]
  )

  const filteredSources = useMemo(() => {
    let result = sources
    const q = search.trim().toLowerCase()
    if (q) {
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.url.toLowerCase().includes(q)
      )
    }
    if (enabledFilter !== 'all') {
      result = result.filter((s) => (enabledFilter === 'enabled' ? s.enabled : !s.enabled))
    }
    return result
  }, [sources, search, enabledFilter])

  const pagedSources = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredSources.slice(start, start + PAGE_SIZE)
  }, [filteredSources, page])

  const updateSourceById = (id: string, patch: Partial<NewsSource>) => {
    setSources((current) => current.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  const saveSources = async () => {
    setSaving(true)
    clearMessage()
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
      showMessage('新闻源已保存。', 'success')
    } catch (error) {
      showMessage(error instanceof Error ? error.message : '保存失败', 'error')
    } finally {
      setSaving(false)
    }
  }

  const showMessage = (text: string, variant: 'success' | 'error' | 'info' = 'info') => {
    setMessage(text)
    setMessageVariant(variant)
  }

  const clearMessage = () => setMessage('')

  const handleAdd = () => {
    const newSource: NewsSource = {
      ...emptySource,
      id: `source-${Date.now()}`,
      defaultCategorySlug: topics[0]?.slug || emptySource.defaultCategorySlug,
    }
    setSources((current) => [...current, newSource])
    setExpandedId(newSource.id)
    setPage(1)
  }

  const handleDelete = (id: string) => {
    setSources((current) => current.filter((s) => s.id !== id))
    setDeleteId(null)
    if (expandedId === id) setExpandedId(null)
  }

  if (loading && sources.length === 0) return <AdminLoading />
  if (loadError) return <AdminError text={loadError} onRetry={loadData} />

  return (
    <div className="p-5 md:p-6">
      <AdminPageHeader
        kicker="News Sources"
        title="新闻源管理"
        description="默认新闻源是公开页面。不同网站会有反爬、登录墙或结构变化；系统会只发布能抓到全文的新闻。"
      >
        <AdminButton variant="secondary" size="sm" onClick={handleAdd}>
          新增新闻源
        </AdminButton>
        <AdminButton variant="primary" size="sm" onClick={saveSources} loading={saving}>
          保存全部
        </AdminButton>
      </AdminPageHeader>

      {message && (
        <AdminMessage variant={messageVariant} onClose={clearMessage}>
          {message}
        </AdminMessage>
      )}

      <Toolbar className="mb-5 rounded-sm">
        <AdminSearchInput
          value={search}
          onChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          placeholder="搜索名称、ID、URL"
          className="w-full md:w-64"
        />
        <div className="w-40">
          <FieldEditor
            label=""
            value={enabledFilter}
            onChange={(v) => {
              setEnabledFilter(v as 'all' | 'enabled' | 'disabled')
              setPage(1)
            }}
            type="select"
            options={[
              { value: 'all', label: '全部状态' },
              { value: 'enabled', label: '已启用' },
              { value: 'disabled', label: '已禁用' },
            ]}
          />
        </div>
      </Toolbar>

      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#737373]">新闻源列表</h2>
            <span className="text-xs text-[#737373]">共 {filteredSources.length} 条</span>
          </div>
          <DataTable
            columns={[
              { key: 'name', label: '名称', className: 'min-w-[10rem]' },
              { key: 'id', label: 'ID' },
              {
                key: 'url',
                label: 'URL',
                render: (item) => (
                  <span className="block max-w-[12rem] truncate text-[#0F1C1A]" title={item.url}>
                    {item.url}
                  </span>
                ),
              },
              {
                key: 'defaultCategorySlug',
                label: '默认分类',
                render: (item) =>
                  topics.find((t) => t.slug === item.defaultCategorySlug)?.title || item.defaultCategorySlug,
              },
              {
                key: 'enabled',
                label: '启用',
                className: 'w-20',
                render: (item) => (
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={(e) => updateSourceById(item.id, { enabled: e.target.checked })}
                    className="h-4 w-4 rounded-sm border-[#E5E5E0] text-[#0F1C1A] focus:ring-[#B08D57]"
                  />
                ),
              },
              {
                key: 'actions',
                label: '操作',
                className: 'w-28',
                render: (item) => (
                  <div className="flex gap-2">
                    <AdminButton
                      variant={expandedId === item.id ? 'primary' : 'secondary'}
                      size="xs"
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    >
                      {expandedId === item.id ? '收起' : '编辑'}
                    </AdminButton>
                    <AdminButton variant="danger" size="xs" onClick={() => setDeleteId(item.id)}>
                      删除
                    </AdminButton>
                  </div>
                ),
              },
            ]}
            data={pagedSources}
            keyExtractor={(item) => item.id}
            emptyText="暂无新闻源。"
            expandedKey={expandedId}
            renderExpanded={(item) => (
              <AdminPanel shadow padding="md" className="m-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#0F1C1A]">编辑新闻源：{item.name || item.id}</h3>
                  <AdminButton variant="ghost" size="xs" onClick={() => setExpandedId(null)}>
                    收起
                  </AdminButton>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <FieldEditor
                    label="名称"
                    value={item.name}
                    onChange={(v) => updateSourceById(item.id, { name: v })}
                    size="sm"
                  />
                  <FieldEditor
                    label="ID"
                    value={item.id}
                    onChange={(v) => updateSourceById(item.id, { id: v })}
                    size="sm"
                  />
                  <FieldEditor
                    label="URL"
                    value={item.url}
                    onChange={(v) => updateSourceById(item.id, { url: v })}
                    type="url"
                    size="sm"
                  />
                  <FieldEditor
                    label="默认分类"
                    value={item.defaultCategorySlug}
                    onChange={(v) => updateSourceById(item.id, { defaultCategorySlug: v })}
                    type="select"
                    options={topicOptions}
                    size="sm"
                  />
                  <FieldEditor
                    label="正文选择器"
                    value={item.articleSelector || ''}
                    onChange={(v) => updateSourceById(item.id, { articleSelector: v })}
                    placeholder="可选，例如 article-content"
                    size="sm"
                  />
                  <FieldEditor
                    label="关键词（每行一个）"
                    value={item.keywords.join('\n')}
                    onChange={(v) =>
                      updateSourceById(item.id, { keywords: v.split('\n').map((k) => k.trim()).filter(Boolean) })
                    }
                    type="textarea"
                    rows={4}
                    size="sm"
                  />
                </div>
              </AdminPanel>
            )}
          />
          <div className="mt-3">
            <Pagination page={page} pageSize={PAGE_SIZE} total={filteredSources.length} onChange={setPage} />
          </div>
        </section>

        <AdminPanel padding="sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#737373]">失败与跳过记录</h2>
          <div className="space-y-2">
            {logs.slice(0, 20).map((log) => (
              <div key={log.id} className="rounded-sm border border-[#E5E5E0] p-3">
                <div className="flex items-center gap-2">
                  <StatusBadge variant={log.status === 'failed' ? 'error' : 'default'}>{log.status}</StatusBadge>
                  <span className="text-xs font-semibold text-[#737373]">{log.sourceName}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-[#0F1C1A]">{log.title || log.url}</p>
                <p className="mt-1 text-xs text-[#737373]">{log.message}</p>
              </div>
            ))}
            {logs.length === 0 && <p className="text-sm text-[#737373]">暂无记录。</p>}
          </div>
        </AdminPanel>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        title="确认删除"
        description="确定要删除这个新闻源吗？删除后无法恢复。"
        confirmText="删除"
        cancelText="取消"
        variant="danger"
        onConfirm={() => deleteId && handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
