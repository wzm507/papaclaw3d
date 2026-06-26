import type { NewsArticle } from './news-types'
import { enhancePublicNewsArticle, normalizeText, stripHtml } from './news-content'
import { listSeoTopics } from './seo-topics'
import { optimizeNewsWithOpenAI } from './openai-news-optimizer'
import { classifyNews, findBestTopicByContent } from './news-classifier'

interface RawNewsItem {
  title: string
  url: string
  summary: string
  publishedAt: string
  sourceName: string
}

interface KeywordCrawlOptions {
  keywords: string[]
  maxResults?: number
  categorySlug?: string
  fetchFullText?: boolean
}

const RSS_SOURCE_POOL: { name: string; url: string; defaultCategorySlug: string }[] = [
  {
    name: '36氪',
    url: 'https://www.36kr.com/feed',
    defaultCategorySlug: 'ai-global-expansion',
  },
  {
    name: '钛媒体',
    url: 'https://www.tmtpost.com/rss.xml',
    defaultCategorySlug: 'ai-global-expansion',
  },
  {
    name: '新浪财经',
    url: 'https://rss.sina.com.cn/roll/finance/hot_roll.xml',
    defaultCategorySlug: 'cross-border-finance',
  },
]

function stripCdata(value: string): string {
  return value.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '')
}

function decodeHtmlEntities(value: string): string {
  return stripCdata(value)
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#\d+;/g, (match) => {
      try {
        return String.fromCodePoint(parseInt(match.slice(2, -1), 10))
      } catch {
        return match
      }
    })
}

function parseRssItems(xml: string, fallbackSourceName = '公开新闻源'): RawNewsItem[] {
  const blocks = Array.from(xml.matchAll(/<item[\s\S]*?<\/item>/gi)).map((match) => match[0])

  return blocks.flatMap((block) => {
    const title = decodeHtmlEntities(stripHtml(block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '')).trim()
    const linkMatch =
      block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] ||
      block.match(/<link[^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] ||
      ''
    const summary = decodeHtmlEntities(stripHtml(block.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] || ''))
    const publishedAt =
      block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1] ||
      block.match(/<published[^>]*>([\s\S]*?)<\/published>/i)?.[1] ||
      block.match(/<updated[^>]*>([\s\S]*?)<\/updated>/i)?.[1] ||
      ''
    const sourceName =
      decodeHtmlEntities(stripHtml(block.match(/<source[^>]*>([\s\S]*?)<\/source>/i)?.[1] || '')) ||
      fallbackSourceName

    let url = stripCdata(linkMatch).trim()
    const guid =
      block.match(/<guid[^>]*isPermaLink=["']true["'][^>]*>([\s\S]*?)<\/guid>/i)?.[1] ||
      block.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i)?.[1]
    if (guid) {
      const cleanGuid = stripCdata(guid).trim()
      if (/^https?:\/\//i.test(cleanGuid)) {
        url = cleanGuid
      }
    }

    if (!url || !/^https?:\/\//i.test(url)) return []
    if (!title || title.length < 5) return []

    return [
      {
        title,
        url,
        summary,
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
        sourceName,
      },
    ]
  })
}

async function fetchRss(url: string, timeout = 20000): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PapaClawNewsCrawler/1.0; +https://www.papaclaw.cn/news)',
        Accept: 'application/rss+xml,application/xml,application/xhtml+xml,text/xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal,
      cache: 'no-store',
      redirect: 'follow',
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    return response.text()
  } finally {
    clearTimeout(timer)
  }
}

async function fetchFullText(url: string, timeout = 15000): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal,
      cache: 'no-store',
      redirect: 'follow',
    })

    if (!response.ok) return ''

    const html = await response.text()
    const patterns = [
      /<article\b[^>]*>([\s\S]*?)<\/article>/i,
      /<main\b[^>]*>([\s\S]*?)<\/main>/i,
      /<div\b[^>]*(?:class|id)=["'][^"']*(article-content|post-content|entry-content|detail-content|content-main|news-content|article_body|article-body)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
    ]

    for (const pattern of patterns) {
      const match = pattern.exec(html)
      if (match) {
        const text = normalizeText(stripHtml(match[2] || match[1]))
        if (text.replace(/\s/g, '').length >= 200) return text
      }
    }

    return ''
  } finally {
    clearTimeout(timer)
  }
}

function isRelevantToKeywords(title: string, summary: string, keywords: string[]): boolean {
  const text = `${title}\n${summary}`.toLowerCase()
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()))
}

function isBlockedDomain(url: string): boolean {
  const blocked = [
    'youtube.com',
    'youtu.be',
    'facebook.com',
    'twitter.com',
    'x.com',
    'instagram.com',
    'tiktok.com',
  ]
  try {
    const hostname = new URL(url).hostname.toLowerCase()
    return blocked.some((domain) => hostname.includes(domain))
  } catch {
    return false
  }
}

export async function fetchNewsByKeywords(options: KeywordCrawlOptions): Promise<{
  ok: true
  fetched: number
  published: number
  articles: NewsArticle[]
  failures: { sourceName: string; url: string; message: string }[]
}> {
  const { keywords, maxResults = 10, categorySlug, fetchFullText = false } = options
  const failures: { sourceName: string; url: string; message: string }[] = []

  if (!keywords.length) {
    throw new Error('关键词不能为空')
  }

  const seenUrls = new Set<string>()
  const candidates: RawNewsItem[] = []

  for (const rssSource of RSS_SOURCE_POOL) {
    try {
      const xml = await fetchRss(rssSource.url)
      const items = parseRssItems(xml, rssSource.name).filter((item) => {
        if (seenUrls.has(item.url)) return false
        if (isBlockedDomain(item.url)) return false
        seenUrls.add(item.url)
        return isRelevantToKeywords(item.title, item.summary, keywords)
      })
      candidates.push(...items)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'RSS 读取失败'
      failures.push({ sourceName: rssSource.name, url: rssSource.url, message })
    }
  }

  const topics = await listSeoTopics()
  const articles: NewsArticle[] = []

  for (const candidate of candidates.slice(0, maxResults)) {
    try {
      let contentText = candidate.summary

      if (fetchFullText) {
        const fullText = await fetchFullText(candidate.url)
        if (fullText) {
          contentText = fullText
        }
      }

      const meaningfulLength = contentText.replace(/\s/g, '').length
      if (meaningfulLength < 80) {
        failures.push({
          sourceName: candidate.sourceName,
          url: candidate.url,
          message: '正文或摘要过短，跳过',
        })
        continue
      }

      const explicitTopic = topics.find((t) => t.slug === categorySlug)
      const classifiedTopic = findBestTopicByContent(candidate.title, candidate.summary, topics)
      const matchedTopic =
        explicitTopic ||
        classifiedTopic ||
        topics.find((t) =>
          [...t.keywords, t.title, t.serviceName].some((term) =>
            `${candidate.title}\n${candidate.summary}`.includes(term)
          )
        ) ||
        topics[0]

      const topic = matchedTopic
      const effectiveCategorySlug = topic?.slug || rssSourcePoolDefaultSlug(candidate.sourceName)

      const article = enhancePublicNewsArticle({
        title: candidate.title,
        sourceName: candidate.sourceName,
        sourceUrl: candidate.url,
        publishedAt: candidate.publishedAt,
        contentText,
        summary: candidate.summary,
        topic: topics.find((t) => t.slug === effectiveCategorySlug) || topic,
      })

      try {
        const optimized = await optimizeNewsWithOpenAI(article)
        articles.push(optimized)
      } catch {
        articles.push(article)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '未知错误'
      failures.push({ sourceName: candidate.sourceName, url: candidate.url, message })
    }
  }

  return {
    ok: true,
    fetched: candidates.length,
    published: articles.length,
    articles,
    failures,
  }
}

function rssSourcePoolDefaultSlug(sourceName: string): string {
  const found = RSS_SOURCE_POOL.find((s) => s.name === sourceName)
  return found?.defaultCategorySlug || 'ai-global-expansion'
}
