import { NextResponse } from 'next/server'
import { submitIndexNowUrls } from '../../../lib/indexnow'
import { listNewsArticles } from '../../../lib/news-store'
import { listSeoTopics } from '../../../lib/seo-topics'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 30

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret && process.env.NODE_ENV !== 'production') return true
  return request.headers.get('authorization') === `Bearer ${secret}`
}

async function collectUrls() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.papaclaw.cn').replace(/\/$/, '')
  const articles = await listNewsArticles()
  const seoTopics = await listSeoTopics()

  return [
    siteUrl,
    `${siteUrl}/news`,
    `${siteUrl}/llms.txt`,
    `${siteUrl}/llms-full.txt`,
    `${siteUrl}/ai-news-feed`,
    ...seoTopics.map((topic) => `${siteUrl}/${topic.slug}`),
    ...articles.map((article) => `${siteUrl}/news/${article.slug}`),
  ]
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const urls = await collectUrls()
    const result = await submitIndexNowUrls(urls)
    return NextResponse.json({ ok: result.ok, status: result.status, submitted: result.submitted })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'IndexNow submit failed' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  return GET(request)
}
