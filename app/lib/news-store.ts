import fs from 'fs/promises'
import path from 'path'
import type { NewsArticle } from './news-types'
import { mergeNewsArticles } from './news-content'

const NEWS_KEY = 'papaclaw:news:articles'
const localNewsPath = path.join(process.cwd(), 'data', 'news.json')

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

async function readLocalArticles(): Promise<NewsArticle[]> {
  try {
    const content = await fs.readFile(localNewsPath, 'utf-8')
    return JSON.parse(content) as NewsArticle[]
  } catch {
    return []
  }
}

async function writeLocalArticles(articles: NewsArticle[]): Promise<void> {
  await fs.mkdir(path.dirname(localNewsPath), { recursive: true })
  await fs.writeFile(localNewsPath, `${JSON.stringify(articles, null, 2)}\n`, 'utf-8')
}

export async function listNewsArticles(): Promise<NewsArticle[]> {
  if (hasKvConfig()) {
    const stored = await kvCommand<string>(['GET', NEWS_KEY])
    if (!stored) return []
    return JSON.parse(stored) as NewsArticle[]
  }

  return readLocalArticles()
}

export async function getNewsArticle(slug: string): Promise<NewsArticle | null> {
  const articles = await listNewsArticles()
  return articles.find((article) => article.slug === slug) ?? null
}

export async function upsertNewsArticles(incoming: NewsArticle[]): Promise<NewsArticle[]> {
  if (process.env.VERCEL && !hasKvConfig()) {
    throw new Error('Vercel deployment requires KV_REST_API_URL and KV_REST_API_TOKEN for news persistence.')
  }

  const existing = await listNewsArticles()
  const merged = mergeNewsArticles(existing, incoming)

  if (hasKvConfig()) {
    await kvCommand<string>(['SET', NEWS_KEY, JSON.stringify(merged)])
  } else {
    await writeLocalArticles(merged)
  }

  return merged
}

