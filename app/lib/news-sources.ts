import fs from 'fs/promises'
import path from 'path'
import type { NewsCrawlLog, NewsSource } from './news-types'

const SOURCES_KEY = 'papaclaw:news:sources'
const LOGS_KEY = 'papaclaw:news:crawl:logs'
const localSourcesPath = path.join(process.cwd(), 'data', 'news-sources.json')
const localLogsPath = path.join(process.cwd(), 'data', 'news-crawl-logs.json')

function hasKvConfig(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

async function kvCommand<T>(command: unknown[]): Promise<T | null> {
  if (!hasKvConfig()) return null

  const response = await fetch(process.env.KV_REST_API_URL!, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`KV request failed: ${response.status}`)
  }

  const payload = (await response.json()) as { result?: T }
  return payload.result ?? null
}

function normalizeSource(source: Partial<NewsSource>, index = 0): NewsSource {
  return {
    id: source.id || `source-${index + 1}`,
    name: source.name || '公开新闻源',
    url: source.url || '',
    enabled: source.enabled !== false,
    defaultCategorySlug: source.defaultCategorySlug || 'ai-global-expansion',
    keywords: Array.isArray(source.keywords) ? source.keywords : [],
    articleSelector: source.articleSelector || '',
  }
}

async function readLocalSources(): Promise<NewsSource[]> {
  try {
    const content = await fs.readFile(localSourcesPath, 'utf-8')
    return (JSON.parse(content) as Partial<NewsSource>[])
      .map(normalizeSource)
      .filter((source) => source.url)
  } catch {
    return []
  }
}

async function writeLocalSources(sources: NewsSource[]): Promise<void> {
  await fs.mkdir(path.dirname(localSourcesPath), { recursive: true })
  await fs.writeFile(localSourcesPath, `${JSON.stringify(sources, null, 2)}\n`, 'utf-8')
}

async function readLocalLogs(): Promise<NewsCrawlLog[]> {
  try {
    const content = await fs.readFile(localLogsPath, 'utf-8')
    return JSON.parse(content) as NewsCrawlLog[]
  } catch {
    return []
  }
}

async function writeLocalLogs(logs: NewsCrawlLog[]): Promise<void> {
  await fs.mkdir(path.dirname(localLogsPath), { recursive: true })
  await fs.writeFile(localLogsPath, `${JSON.stringify(logs.slice(0, 200), null, 2)}\n`, 'utf-8')
}

export async function listNewsSources(): Promise<NewsSource[]> {
  if (hasKvConfig()) {
    const stored = await kvCommand<string>(['GET', SOURCES_KEY])
    if (!stored) return readLocalSources()
    return (JSON.parse(stored) as Partial<NewsSource>[])
      .map(normalizeSource)
      .filter((source) => source.url)
  }

  return readLocalSources()
}

export async function saveNewsSources(sources: NewsSource[]): Promise<void> {
  const normalized = sources.map(normalizeSource).filter((source) => source.url)

  if (process.env.VERCEL && !hasKvConfig()) {
    throw new Error('Vercel deployment requires KV_REST_API_URL and KV_REST_API_TOKEN for news source persistence.')
  }

  if (hasKvConfig()) {
    await kvCommand<string>(['SET', SOURCES_KEY, JSON.stringify(normalized)])
    return
  }

  await writeLocalSources(normalized)
}

export async function listNewsCrawlLogs(): Promise<NewsCrawlLog[]> {
  if (hasKvConfig()) {
    const stored = await kvCommand<string>(['GET', LOGS_KEY])
    if (!stored) return []
    return JSON.parse(stored) as NewsCrawlLog[]
  }

  return readLocalLogs()
}

export async function appendNewsCrawlLogs(incoming: NewsCrawlLog[]): Promise<NewsCrawlLog[]> {
  const existing = await listNewsCrawlLogs()
  const next = [...incoming, ...existing].slice(0, 200)

  if (hasKvConfig()) {
    await kvCommand<string>(['SET', LOGS_KEY, JSON.stringify(next)])
  } else {
    await writeLocalLogs(next)
  }

  return next
}
