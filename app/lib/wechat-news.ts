import type { WechatArticleInput } from './news-types'
import { normalizeText, stripHtml } from './news-content'

interface WechatAccessTokenResponse {
  access_token?: string
  expires_in?: number
  errcode?: number
  errmsg?: string
}

interface WechatNewsItem {
  title?: string
  digest?: string
  content?: string
  content_source_url?: string
  url?: string
  thumb_url?: string
  create_time?: number
  update_time?: number
}

interface WechatPublishItem {
  article_id?: string
  update_time?: number
  content?: {
    news_item?: WechatNewsItem[]
  }
}

interface WechatBatchResponse {
  item?: WechatPublishItem[]
  total_count?: number
  item_count?: number
  errcode?: number
  errmsg?: string
}

function assertWechatOk(payload: { errcode?: number; errmsg?: string }, action: string): void {
  if (payload.errcode && payload.errcode !== 0) {
    throw new Error(`${action} failed: ${payload.errcode} ${payload.errmsg || ''}`.trim())
  }
}

function toIso(seconds?: number): string {
  if (!seconds) return new Date().toISOString()
  return new Date(seconds * 1000).toISOString()
}

async function getAccessToken(appId: string, appSecret: string): Promise<string> {
  const url = new URL('https://api.weixin.qq.com/cgi-bin/token')
  url.searchParams.set('grant_type', 'client_credential')
  url.searchParams.set('appid', appId)
  url.searchParams.set('secret', appSecret)

  const response = await fetch(url, { cache: 'no-store' })
  const payload = (await response.json()) as WechatAccessTokenResponse
  assertWechatOk(payload, 'Wechat access token')

  if (!payload.access_token) {
    throw new Error('Wechat access token response did not include access_token.')
  }

  return payload.access_token
}

export async function fetchWechatPublishedArticles(options: {
  appId: string
  appSecret: string
  limit?: number
}): Promise<WechatArticleInput[]> {
  const accessToken = await getAccessToken(options.appId, options.appSecret)
  const count = Math.min(Math.max(options.limit || 20, 1), 20)
  const response = await fetch(`https://api.weixin.qq.com/cgi-bin/freepublish/batchget?access_token=${accessToken}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      offset: 0,
      count,
      no_content: 0,
    }),
    cache: 'no-store',
  })

  const payload = (await response.json()) as WechatBatchResponse
  assertWechatOk(payload, 'Wechat freepublish batchget')

  const articles: WechatArticleInput[] = []
  for (const item of payload.item || []) {
    for (const newsItem of item.content?.news_item || []) {
      if (!newsItem.title) continue

      const sourceUrl = newsItem.url || newsItem.content_source_url || ''
      const contentText = normalizeText(stripHtml(newsItem.content || ''))
      const id = item.article_id ? `${item.article_id}:${newsItem.title}` : `${sourceUrl}:${newsItem.title}`

      articles.push({
        id,
        title: newsItem.title,
        digest: newsItem.digest,
        contentHtml: newsItem.content,
        contentText,
        sourceUrl,
        publishedAt: toIso(newsItem.update_time || newsItem.create_time || item.update_time),
        coverImage: newsItem.thumb_url,
      })
    }
  }

  return articles
}

