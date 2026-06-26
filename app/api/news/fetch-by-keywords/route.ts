import { NextResponse } from 'next/server'
import { fetchNewsByKeywords } from '../../../lib/news-keyword-crawler'
import { upsertNewsArticles } from '../../../lib/news-store'
import { appendNewsCrawlLogs } from '../../../lib/news-sources'
import { submitIndexNowUrls } from '../../../lib/indexnow'
import { listSeoTopics } from '../../../lib/seo-topics'
import type { NewsCrawlLog } from '../../../lib/news-types'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 120

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret && process.env.NODE_ENV !== 'production') return true
  if (!secret) return false

  return request.headers.get('authorization') === `Bearer ${secret}`
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.papaclaw.cn').replace(/\/$/, '')
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as {
      keywords?: string[]
      maxResults?: number
      categorySlug?: string
      fetchFullText?: boolean
    }

    const keywords = Array.isArray(body.keywords)
      ? body.keywords.map((k) => String(k).trim()).filter(Boolean)
      : []

    if (keywords.length === 0) {
      return NextResponse.json({ error: 'keywords 不能为空数组' }, { status: 400 })
    }

    const result = await fetchNewsByKeywords({
      keywords,
      maxResults: Math.min(Number(body.maxResults) || 10, 20),
      categorySlug: body.categorySlug,
      fetchFullText: body.fetchFullText,
    })

    const logs: NewsCrawlLog[] = [
      ...result.articles.map((article) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        sourceId: 'keyword-crawler',
        sourceName: article.sourceName,
        url: article.sourceUrl,
        title: article.title,
        categorySlug: article.categorySlug,
        status: 'published' as const,
        message: `关键词 [${keywords.join(', ')}] 抓取成功`,
        createdAt: new Date().toISOString(),
      })),
      ...result.failures.map((failure) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        sourceId: 'keyword-crawler',
        sourceName: failure.sourceName,
        url: failure.url,
        title: '',
        categorySlug: body.categorySlug,
        status: 'failed' as const,
        message: failure.message,
        createdAt: new Date().toISOString(),
      })),
    ]

    if (logs.length > 0) {
      await appendNewsCrawlLogs(logs)
    }

    const stored = result.articles.length > 0 ? await upsertNewsArticles(result.articles) : await import('../../../lib/news-store').then((m) => m.listNewsArticles())

    let indexNow:
      | {
          ok: boolean
          status: number
          submitted: number
        }
      | undefined

    if (result.articles.length > 0) {
      try {
        const topics = await listSeoTopics()
        const url = siteUrl()
        const indexNowResult = await submitIndexNowUrls([
          url,
          `${url}/news`,
          `${url}/ai-news-feed`,
          ...topics.map((topic) => `${url}/${topic.slug}`),
          ...result.articles.map((article) => `${url}/news/${article.slug}`),
        ])
        indexNow = {
          ok: indexNowResult.ok,
          status: indexNowResult.status,
          submitted: indexNowResult.submitted,
        }
      } catch {
        indexNow = { ok: false, status: 0, submitted: 0 }
      }
    }

    return NextResponse.json({
      ok: true,
      keywords,
      fetched: result.fetched,
      published: result.published,
      failures: result.failures.length,
      failureDetails: result.failures.slice(0, 10),
      stored: stored.length,
      latest: stored.slice(0, 5).map((article) => ({
        title: article.title,
        slug: article.slug,
        publishedAt: article.publishedAt,
        categoryName: article.categoryName,
      })),
      indexNow,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown keyword fetch error'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  return POST(request)
}
