'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import AdminPageHeader from '../components/AdminPageHeader'
import AdminButton from '../components/AdminButton'
import Toolbar from '../components/Toolbar'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import FieldEditor from '../components/FieldEditor'
import ListEditor from '../components/ListEditor'
import AdminLoading from '../components/AdminLoading'
import AdminError from '../components/AdminError'
import ConfirmDialog from '../components/ConfirmDialog'
import AdminSearchInput from '../components/AdminSearchInput'
import Pagination from '../components/Pagination'
import AdminMessage from '../components/AdminMessage'
import AdminPanel from '../components/AdminPanel'

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

const PAGE_SIZE = 10

function emptyTopic(tempSlug: string): SeoTopic {
  return {
    slug: tempSlug,
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
  const [loadError, setLoadError] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageVariant, setMessageVariant] = useState<'success' | 'error' | 'info'>('info')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTopics() {
      setLoading(true)
      setLoadError('')
      try {
        const response = await fetch('/api/seo-topics', { cache: 'no-store' })
        if (!response.ok) throw new Error('获取SEO专题失败')
        const data = await response.json()
        setTopics(data)
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : '加载失败')
      } finally {
        setLoading(false)
      }
    }
    fetchTopics()
  }, [])

  const filteredTopics = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return topics
    return topics.filter(
      (topic) =>
        topic.slug.toLowerCase().includes(q) ||
        topic.title.toLowerCase().includes(q) ||
        topic.serviceName.toLowerCase().includes(q)
    )
  }, [topics, search])

  const pagedTopics = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredTopics.slice(start, start + PAGE_SIZE)
  }, [filteredTopics, page])

  const updateTopicBySlug = (slug: string, patch: Partial<SeoTopic>) => {
    setTopics((current) => current.map((t) => (t.slug === slug ? { ...t, ...patch } : t)))
  }

  const showMessage = (text: string, variant: 'success' | 'error' | 'info' = 'info') => {
    setMessage(text)
    setMessageVariant(variant)
  }

  const clearMessage = () => setMessage('')

  const handleSave = async () => {
    setSaving(true)
    clearMessage()
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
      showMessage(`SEO专题页已保存。${pushText}`, 'success')
    } catch (error) {
      showMessage(error instanceof Error ? error.message : '保存失败，请重试', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleAdd = () => {
    const tempSlug = `new-topic-${Date.now()}`
    const newTopic = emptyTopic(tempSlug)
    setTopics((current) => [newTopic, ...current])
    setExpandedSlug(tempSlug)
    setPage(1)
  }

  const handleDelete = (slug: string) => {
    setTopics((current) => current.filter((t) => t.slug !== slug))
    setDeleteSlug(null)
    if (expandedSlug === slug) setExpandedSlug(null)
  }

  if (loading && topics.length === 0) return <AdminLoading />
  if (loadError) return <AdminError text={loadError} onRetry={() => window.location.reload()} />

  return (
    <div className="p-5 md:p-6">
      <AdminPageHeader
        kicker="SEO Topics"
        title="SEO专题页管理"
        description="管理这里会影响：专题页 URL、页面标题、关键词、FAQ、sitemap、llms.txt、llms-full.txt 和 IndexNow 推送。"
      >
        <AdminButton variant="secondary" size="sm" onClick={handleAdd}>
          新增专题
        </AdminButton>
        <AdminButton variant="primary" size="sm" onClick={handleSave} loading={saving}>
          保存全部
        </AdminButton>
      </AdminPageHeader>

      {message && (
        <AdminMessage variant={messageVariant} onClose={clearMessage}>
          {message}
        </AdminMessage>
      )}

      <AdminPanel padding="sm" className="mb-5">
        <p className="text-sm leading-7 text-[#737373]">
          Slug 只能使用小写英文、数字和连字符，例如 <code>ai-global-expansion</code>。
          保存后会更新专题页、sitemap、llms.txt、llms-full.txt 并触发 IndexNow 推送。
        </p>
      </AdminPanel>

      <Toolbar className="mb-5 rounded-sm">
        <AdminSearchInput
          value={search}
          onChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          placeholder="搜索 slug、标题、服务名"
          className="w-full md:w-72"
        />
      </Toolbar>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#737373]">专题列表</h2>
          <span className="text-xs text-[#737373]">共 {filteredTopics.length} 条</span>
        </div>
        <DataTable
          columns={[
            { key: 'slug', label: 'Slug', className: 'min-w-[10rem]' },
            { key: 'title', label: '页面主标题', className: 'min-w-[12rem]' },
            { key: 'serviceName', label: '服务名称' },
            {
              key: 'keywords',
              label: '关键词',
              render: (item) => item.keywords.length,
            },
            {
              key: 'faq',
              label: 'FAQ',
              render: (item) => item.faq.length,
            },
            {
              key: 'status',
              label: '状态',
              className: 'w-24',
              render: (item) => (
                <StatusBadge variant={item.slug && item.title ? 'success' : 'default'}>
                  {item.slug && item.title ? '有效' : '待完善'}
                </StatusBadge>
              ),
            },
            {
              key: 'actions',
              label: '操作',
              className: 'w-36',
              render: (item) => (
                <div className="flex flex-wrap gap-2">
                  <AdminButton
                    variant={expandedSlug === item.slug ? 'primary' : 'secondary'}
                    size="xs"
                    onClick={() => setExpandedSlug(expandedSlug === item.slug ? null : item.slug)}
                  >
                    {expandedSlug === item.slug ? '收起' : '编辑'}
                  </AdminButton>
                  <AdminButton variant="danger" size="xs" onClick={() => setDeleteSlug(item.slug)}>
                    删除
                  </AdminButton>
                  {item.slug && (
                    <AdminButton variant="ghost" size="xs" asChild>
                      <Link href={`/${item.slug}`} target="_blank">
                        预览
                      </Link>
                    </AdminButton>
                  )}
                </div>
              ),
            },
          ]}
          data={pagedTopics}
          keyExtractor={(item) => item.slug}
          emptyText="暂无 SEO 专题。"
          expandedKey={expandedSlug}
          renderExpanded={(item) => (
            <AdminPanel shadow padding="md" className="m-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#0F1C1A]">编辑专题：{item.title || item.slug}</h3>
                <AdminButton variant="ghost" size="xs" onClick={() => setExpandedSlug(null)}>
                  收起
                </AdminButton>
              </div>
              <div className="space-y-4">
                <div className="grid gap-3 lg:grid-cols-3">
                  <FieldEditor
                    label="Slug / URL路径"
                    value={item.slug}
                    onChange={(v) => updateTopicBySlug(item.slug, { slug: v })}
                    placeholder="ai-global-expansion"
                    size="sm"
                  />
                  <FieldEditor
                    label="页面主标题"
                    value={item.title}
                    onChange={(v) => updateTopicBySlug(item.slug, { title: v })}
                    size="sm"
                  />
                  <FieldEditor
                    label="SEO标题"
                    value={item.metaTitle}
                    onChange={(v) => updateTopicBySlug(item.slug, { metaTitle: v })}
                    size="sm"
                  />
                </div>

                <FieldEditor
                  label="页面描述 / Meta Description"
                  value={item.description}
                  onChange={(v) => updateTopicBySlug(item.slug, { description: v })}
                  type="textarea"
                  rows={3}
                  size="sm"
                />

                <FieldEditor
                  label="关键词（英文逗号或中文逗号分隔）"
                  value={commaText(item.keywords)}
                  onChange={(v) => updateTopicBySlug(item.slug, { keywords: parseCommaText(v) })}
                  placeholder="AI科技出海, AI出海服务商"
                  size="sm"
                />

                <FieldEditor
                  label="服务名称"
                  value={item.serviceName}
                  onChange={(v) => updateTopicBySlug(item.slug, { serviceName: v })}
                  size="sm"
                />

                <div className="grid gap-3 lg:grid-cols-2">
                  <FieldEditor
                    label="服务对象（每行一条）"
                    value={item.audience.join('\n')}
                    onChange={(v) => updateTopicBySlug(item.slug, { audience: parseLines(v) })}
                    type="textarea"
                    rows={4}
                    size="sm"
                  />
                  <FieldEditor
                    label="解决什么问题（每行一条）"
                    value={item.problems.join('\n')}
                    onChange={(v) => updateTopicBySlug(item.slug, { problems: parseLines(v) })}
                    type="textarea"
                    rows={4}
                    size="sm"
                  />
                  <FieldEditor
                    label="Papa Claw为什么能做（每行一条）"
                    value={item.papaClawAdvantages.join('\n')}
                    onChange={(v) => updateTopicBySlug(item.slug, { papaClawAdvantages: parseLines(v) })}
                    type="textarea"
                    rows={4}
                    size="sm"
                  />
                  <FieldEditor
                    label="服务推进路径（每行一条）"
                    value={item.process.join('\n')}
                    onChange={(v) => updateTopicBySlug(item.slug, { process: parseLines(v) })}
                    type="textarea"
                    rows={4}
                    size="sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#0F1C1A]">FAQ问答</label>
                  <ListEditor
                    items={item.faq}
                    onChange={(faq) => updateTopicBySlug(item.slug, { faq })}
                    addItem={() => ({ question: '', answer: '' })}
                    itemLabel="FAQ"
                    renderItem={(faq, _index, onFaqChange) => (
                      <div className="space-y-3 pr-20">
                        <FieldEditor
                          label="问题"
                          value={faq.question}
                          onChange={(value) => onFaqChange({ ...faq, question: value })}
                          size="sm"
                        />
                        <FieldEditor
                          label="回答"
                          value={faq.answer}
                          onChange={(value) => onFaqChange({ ...faq, answer: value })}
                          type="textarea"
                          rows={3}
                          size="sm"
                        />
                      </div>
                    )}
                  />
                </div>

                <div className="rounded-sm border border-[#E5E5E0] bg-[#F7F7F5] p-3 text-xs text-[#737373]">
                  预览地址：/{item.slug || `new-seo-topic`}
                </div>
              </div>
            </AdminPanel>
          )}
        />
        <div className="mt-3">
          <Pagination page={page} pageSize={PAGE_SIZE} total={filteredTopics.length} onChange={setPage} />
        </div>
      </section>

      <ConfirmDialog
        open={deleteSlug !== null}
        title="确认删除"
        description="确定要删除这个 SEO 专题吗？删除后无法恢复。"
        confirmText="删除"
        cancelText="取消"
        variant="danger"
        onConfirm={() => deleteSlug && handleDelete(deleteSlug)}
        onCancel={() => setDeleteSlug(null)}
      />
    </div>
  )
}
