import { NextResponse } from 'next/server'
import { enhancePublicNewsArticle } from '../../../lib/news-content'
import { optimizeNewsWithOpenAI } from '../../../lib/openai-news-optimizer'
import { upsertNewsArticles } from '../../../lib/news-store'
import { submitIndexNowUrls } from '../../../lib/indexnow'
import { getSeoTopic, listSeoTopics } from '../../../lib/seo-topics'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.papaclaw.cn').replace(/\/$/, '')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const title = String(body.title || '').trim()
    const sourceName = String(body.sourceName || '手动上传新闻').trim()
    const sourceUrl = String(body.sourceUrl || body.originalUrl || '').trim()
    const contentText = String(body.contentText || '').trim()
    const categorySlug = String(body.categorySlug || 'ai-global-expansion').trim()

    if (!title || !sourceUrl || !contentText) {
      return NextResponse.json({ error: 'title, sourceUrl and contentText are required' }, { status: 400 })
    }

    if (contentText.replace(/\s/g, '').length < 300) {
      return NextResponse.json({ error: '正文少于 300 字，不建议作为官网新闻发布' }, { status: 400 })
    }

    const topic = await getSeoTopic(categorySlug)
    const article = enhancePublicNewsArticle({
      title,
      sourceName,
      sourceUrl,
      publishedAt: body.publishedAt ? new Date(body.publishedAt).toISOString() : new Date().toISOString(),
      contentText,
      summary: body.summary,
      coverImage: body.coverImage,
      topic,
      sourceType: 'manual',
      crawlStatus: 'manual',
      manualOverride: true,
    })

    const optimized = await optimizeNewsWithOpenAI(article)
    const stored = await upsertNewsArticles([optimized])

    let indexNow
    try {
      const url = siteUrl()
      const topics = await listSeoTopics()
      const result = await submitIndexNowUrls([
        url,
        `${url}/news`,
        `${url}/news/${optimized.slug}`,
        ...topics.map((item) => `${url}/${item.slug}`),
      ])
      indexNow = {
        ok: result.ok,
        status: result.status,
        submitted: result.submitted,
      }
    } catch {
      indexNow = { ok: false, status: 0, submitted: 0 }
    }

    return NextResponse.json({ ok: true, article: optimized, stored: stored.length, indexNow })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown manual news error'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
