import fs from 'fs/promises'
import path from 'path'

export interface SeoTopicFaq {
  question: string
  answer: string
}

export interface SeoTopic {
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

const SEO_TOPICS_KEY = 'papaclaw:seo:topics'
const localSeoTopicsPath = path.join(process.cwd(), 'data', 'seo-topics.json')

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

function normalizeTopic(topic: Partial<SeoTopic>): SeoTopic {
  return {
    slug: topic.slug || '',
    title: topic.title || '',
    metaTitle: topic.metaTitle || topic.title || '',
    description: topic.description || '',
    keywords: Array.isArray(topic.keywords) ? topic.keywords : [],
    serviceName: topic.serviceName || topic.title || '',
    audience: Array.isArray(topic.audience) ? topic.audience : [],
    problems: Array.isArray(topic.problems) ? topic.problems : [],
    papaClawAdvantages: Array.isArray(topic.papaClawAdvantages) ? topic.papaClawAdvantages : [],
    process: Array.isArray(topic.process) ? topic.process : [],
    faq: Array.isArray(topic.faq) ? topic.faq : [],
  }
}

async function readLocalSeoTopics(): Promise<SeoTopic[]> {
  try {
    const content = await fs.readFile(localSeoTopicsPath, 'utf-8')
    const parsed = JSON.parse(content) as Partial<SeoTopic>[]
    return parsed.map(normalizeTopic).filter((topic) => topic.slug && topic.title)
  } catch {
    return []
  }
}

async function writeLocalSeoTopics(topics: SeoTopic[]): Promise<void> {
  await fs.mkdir(path.dirname(localSeoTopicsPath), { recursive: true })
  await fs.writeFile(localSeoTopicsPath, `${JSON.stringify(topics, null, 2)}\n`, 'utf-8')
}

export async function listSeoTopics(): Promise<SeoTopic[]> {
  if (hasKvConfig()) {
    const stored = await kvCommand<string>(['GET', SEO_TOPICS_KEY])
    if (!stored) return readLocalSeoTopics()
    return (JSON.parse(stored) as Partial<SeoTopic>[])
      .map(normalizeTopic)
      .filter((topic) => topic.slug && topic.title)
  }

  return readLocalSeoTopics()
}

export async function getSeoTopic(slug: string): Promise<SeoTopic | null> {
  const topics = await listSeoTopics()
  return topics.find((topic) => topic.slug === slug) ?? null
}

export async function saveSeoTopics(topics: SeoTopic[]): Promise<void> {
  if (process.env.VERCEL && !hasKvConfig()) {
    throw new Error('Vercel deployment requires KV_REST_API_URL and KV_REST_API_TOKEN for SEO topic persistence.')
  }

  if (hasKvConfig()) {
    await kvCommand<string>(['SET', SEO_TOPICS_KEY, JSON.stringify(topics)])
    return
  }

  await writeLocalSeoTopics(topics)
}
