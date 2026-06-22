import { enhanceWechatArticle } from './news-content'
import { optimizeNewsWithOpenAI } from './openai-news-optimizer'
import { upsertNewsArticles } from './news-store'
import { fetchWechatPublishedArticles } from './wechat-news'
import { submitIndexNowUrls } from './indexnow'
import type { NewsArticle } from './news-types'

export interface NewsSyncResult {
  ok: true
  fetched: number
  stored: number
  indexNow?: {
    ok: boolean
    status: number
    submitted: number
  }
  latest: Pick<NewsArticle, 'title' | 'slug' | 'publishedAt'>[]
}

export async function syncWechatNews(): Promise<NewsSyncResult> {
  const appId = process.env.WECHAT_APP_ID || 'wx4331c2eca38d85e7'
  const appSecret = process.env.WECHAT_APP_SECRET

  if (!appSecret) {
    throw new Error('Missing WECHAT_APP_SECRET. Add it in Vercel environment variables before running sync.')
  }

  const rawArticles = await fetchWechatPublishedArticles({
    appId,
    appSecret,
    limit: Number(process.env.WECHAT_SYNC_LIMIT || 20),
  })

  const enhanced = await Promise.all(
    rawArticles.map(async (article) => optimizeNewsWithOpenAI(enhanceWechatArticle(article)))
  )

  const stored = await upsertNewsArticles(enhanced)
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.papaclaw.com').replace(/\/$/, '')
  let indexNow: NewsSyncResult['indexNow']

  try {
    const indexNowResult = await submitIndexNowUrls([
      siteUrl,
      `${siteUrl}/news`,
      `${siteUrl}/ai-news-feed`,
      ...enhanced.map((article) => `${siteUrl}/news/${article.slug}`),
    ])
    indexNow = {
      ok: indexNowResult.ok,
      status: indexNowResult.status,
      submitted: indexNowResult.submitted,
    }
  } catch {
    indexNow = {
      ok: false,
      status: 0,
      submitted: 0,
    }
  }

  return {
    ok: true,
    fetched: rawArticles.length,
    stored: stored.length,
    indexNow,
    latest: stored.slice(0, 5).map((article) => ({
      title: article.title,
      slug: article.slug,
      publishedAt: article.publishedAt,
    })),
  }
}
