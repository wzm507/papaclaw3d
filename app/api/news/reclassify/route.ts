import { NextResponse } from 'next/server'
import { listNewsArticles, upsertNewsArticles } from '../../../lib/news-store'
import { findBestTopicByContent } from '../../../lib/news-classifier'
import { listSeoTopics } from '../../../lib/seo-topics'
import { submitIndexNowUrls } from '../../../lib/indexnow'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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
    const [articles, topics] = await Promise.all([listNewsArticles(), listSeoTopics()])
    let changed = 0

    for (const article of articles) {
      const textSource = article.searchableTitle || article.title
      const matchedTopic = findBestTopicByContent(textSource, article.summary, topics)

      if (matchedTopic && article.categorySlug !== matchedTopic.slug) {
        article.categorySlug = matchedTopic.slug
        article.categoryName = matchedTopic.title
        article.updatedAt = new Date().toISOString()
        changed++
      }
    }

    if (changed > 0) {
      await upsertNewsArticles(articles)
    }

    try {
      const url = siteUrl()
      await submitIndexNowUrls([`${url}/news`, ...articles.slice(0, 20).map((a) => `${url}/news/${a.slug}`)])
    } catch {
      // ignore indexnow errors
    }

    const distribution = articles.reduce<Record<string, number>>((acc, article) => {
      acc[article.categoryName] = (acc[article.categoryName] || 0) + 1
      return acc
    }, {})

    return NextResponse.json({
      ok: true,
      total: articles.length,
      changed,
      distribution,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown reclassify error'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
