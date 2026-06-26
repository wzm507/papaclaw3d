import type { NewsArticle, NewsCrawlLog, NewsSource } from './news-types'
import { chooseNewsCategory, enhancePublicNewsArticle, normalizeText, stripHtml } from './news-content'
import { listNewsSources, appendNewsCrawlLogs } from './news-sources'
import { optimizeNewsWithOpenAI } from './openai-news-optimizer'
import { listNewsArticles, upsertNewsArticles } from './news-store'
import { submitIndexNowUrls } from './indexnow'
import { listSeoTopics } from './seo-topics'

interface CandidateArticle {
  title: string
  url: string
  summary?: string
  publishedAt?: string
}

export interface NewsSyncResult {
  ok: true
  fetched: number
  published: number
  failed: number
  stored: number
  indexNow?: {
    ok: boolean
    status: number
    submitted: number
  }
  latest: Pick<NewsArticle, 'title' | 'slug' | 'publishedAt' | 'categoryName'>[]
  failures: Pick<NewsCrawlLog, 'sourceName' | 'url' | 'message'>[]
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.papaclaw.cn').replace(/\/$/, '')
}

function makeLog(
  source: NewsSource,
  status: NewsCrawlLog['status'],
  message: string,
  url: string,
  title?: string,
  categorySlug?: string
): NewsCrawlLog {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    sourceId: source.id,
    sourceName: source.name,
    url,
    title,
    categorySlug,
    status,
    message,
    createdAt: new Date().toISOString(),
  }
}

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
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; PapaClawNewsCrawler/1.0; +https://www.papaclaw.cn/news)',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    cache: 'no-store',
    redirect: 'follow',
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.text()
}

function normalizeUrl(url: string, baseUrl: string): string | null {
  try {
    return new URL(decodeHtmlEntities(url), baseUrl).toString().split('#')[0]
  } catch {
    return null
  }
}

function isRelevant(title: string, url: string, source: NewsSource): boolean {
  const text = `${title}\n${url}`
  const keywords = source.keywords.length > 0 ? source.keywords : ['出海', '跨境', '外贸', '中东', 'AI']
  return keywords.some((keyword) => text.includes(keyword))
}

function parseXmlCandidates(xml: string, source: NewsSource): CandidateArticle[] {
  const blocks = Array.from(xml.matchAll(/<(item|entry)[\s\S]*?<\/\1>/gi)).map((match) => match[0])

  return blocks
    .flatMap((block) => {
      const title = decodeHtmlEntities(stripHtml(block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || ''))
      const rawLink =
        block.match(/<link[^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] ||
        block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] ||
        ''
      const link = stripCdata(rawLink).trim()
      const summary = decodeHtmlEntities(stripHtml(block.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] || ''))
      const publishedAt =
        block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1] ||
        block.match(/<published[^>]*>([\s\S]*?)<\/published>/i)?.[1] ||
        block.match(/<updated[^>]*>([\s\S]*?)<\/updated>/i)?.[1] ||
        ''
      const url = normalizeUrl(link.trim(), source.url)

      return url && title ? [{ title: normalizeText(title), url, summary: normalizeText(summary), publishedAt }] : []
    })
    .filter((item) => isRelevant(item.title, item.url, source))
    .slice(0, Number(process.env.PUBLIC_NEWS_SOURCE_LIMIT || 8))
}

function parseHtmlCandidates(html: string, source: NewsSource): CandidateArticle[] {
  const candidates = new Map<string, CandidateArticle>()
  const anchorPattern = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
  let match: RegExpExecArray | null

  while ((match = anchorPattern.exec(html))) {
    const url = normalizeUrl(match[1], source.url)
    const title = normalizeText(decodeHtmlEntities(stripHtml(match[2])))

    if (!url || title.length < 8 || title.length > 90) continue
    if (!/^https?:\/\//i.test(url)) continue
    if (/\.(jpg|jpeg|png|gif|webp|svg|pdf|zip)$/i.test(url)) continue
    if (!isRelevant(title, url, source)) continue

    candidates.set(url, { title, url })
  }

  return Array.from(candidates.values()).slice(0, Number(process.env.PUBLIC_NEWS_SOURCE_LIMIT || 8))
}

function parseCandidates(payload: string, source: NewsSource): CandidateArticle[] {
  if (/<rss|<feed|<item|<entry/i.test(payload.slice(0, 2000))) {
    return parseXmlCandidates(payload, source)
  }

  return parseHtmlCandidates(payload, source)
}

function extractBySelector(html: string, selector: string): string {
  if (!selector) return ''

  const cleanSelector = selector.trim().replace(/^[.#]/, '')
  if (!cleanSelector) return ''

  const classPattern = new RegExp(
    `<([a-z0-9]+)[^>]*class=["'][^"']*${cleanSelector}[^"']*["'][^>]*>([\\s\\S]*?)<\\/\\1>`,
    'i'
  )
  const idPattern = new RegExp(
    `<([a-z0-9]+)[^>]*id=["']${cleanSelector}["'][^>]*>([\\s\\S]*?)<\\/\\1>`,
    'i'
  )

  return classPattern.exec(html)?.[2] || idPattern.exec(html)?.[2] || ''
}

function extractArticleHtml(html: string, selector?: string): string {
  const selected = selector ? extractBySelector(html, selector) : ''
  if (selected) return selected

  const patterns = [
    /<article\b[^>]*>([\s\S]*?)<\/article>/i,
    /<main\b[^>]*>([\s\S]*?)<\/main>/i,
    /<div\b[^>]*(?:class|id)=["'][^"']*(article-content|post-content|entry-content|detail-content|content|article|news-detail)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
  ]

  for (const pattern of patterns) {
    const match = pattern.exec(html)
    if (match) return match[2] || match[1]
  }

  return html
}

function parsePublishedAt(candidate: CandidateArticle, html: string): string {
  const rawDate =
    candidate.publishedAt ||
    html.match(/(?:datePublished|publishTime|pubdate)["']?\s*[:=]\s*["']([^"']+)["']/i)?.[1] ||
    html.match(/(\d{4}[-/年]\d{1,2}[-/月]\d{1,2})/i)?.[1] ||
    ''

  const normalized = rawDate.replace(/[年月]/g, '-').replace(/日/g, '')
  const timestamp = Date.parse(normalized)
  return Number.isNaN(timestamp) ? new Date().toISOString() : new Date(timestamp).toISOString()
}

async function fetchFullArticle(candidate: CandidateArticle, source: NewsSource) {
  const html = await fetchText(candidate.url)
  const contentHtml = extractArticleHtml(html, source.articleSelector)
  const contentText = normalizeText(stripHtml(contentHtml))
  const meaningfulLength = contentText.replace(/\s/g, '').length

  if (meaningfulLength < Number(process.env.PUBLIC_NEWS_MIN_CHARS || 500)) {
    throw new Error('正文抓取不足 500 字，按强制全文规则不发布')
  }

  return {
    contentText,
    publishedAt: parsePublishedAt(candidate, html),
  }
}

export async function syncPublicNews(): Promise<NewsSyncResult> {
  const [sources, topics] = await Promise.all([listNewsSources(), listSeoTopics()])
  const enabledSources = sources.filter((source) => source.enabled)
  const logs: NewsCrawlLog[] = []
  const articles: NewsArticle[] = []
  let fetched = 0

  for (const source of enabledSources) {
    try {
      const payload = await fetchText(source.url)
      const candidates = parseCandidates(payload, source)
      fetched += candidates.length

      for (const candidate of candidates) {
        try {
          const fullArticle = await fetchFullArticle(candidate, source)
          const topic = chooseNewsCategory(
            candidate.title,
            fullArticle.contentText,
            topics,
            source.defaultCategorySlug
          )
          const article = enhancePublicNewsArticle({
            title: candidate.title,
            sourceName: source.name,
            sourceUrl: candidate.url,
            publishedAt: fullArticle.publishedAt,
            contentText: fullArticle.contentText,
            summary: candidate.summary,
            topic,
          })
          const optimized = await optimizeNewsWithOpenAI(article)
          articles.push(optimized)
          logs.push(makeLog(source, 'published', '已抓取全文并发布', candidate.url, candidate.title, topic?.slug))
        } catch (error) {
          const message = error instanceof Error ? error.message : '未知抓取错误'
          logs.push(makeLog(source, 'failed', message, candidate.url, candidate.title))
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '新闻源读取失败'
      logs.push(makeLog(source, 'failed', message, source.url))
    }
  }

  if (logs.length > 0) {
    await appendNewsCrawlLogs(logs)
  }

  const stored = articles.length > 0 ? await upsertNewsArticles(articles) : await listNewsArticles()
  let indexNow: NewsSyncResult['indexNow']

  if (articles.length > 0) {
    try {
      const url = siteUrl()
      const indexNowResult = await submitIndexNowUrls([
        url,
        `${url}/news`,
        `${url}/ai-news-feed`,
        ...topics.map((topic) => `${url}/${topic.slug}`),
        ...articles.map((article) => `${url}/news/${article.slug}`),
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
  }

  return {
    ok: true,
    fetched,
    published: articles.length,
    failed: logs.filter((log) => log.status === 'failed').length,
    stored: stored.length,
    indexNow,
    latest: stored.slice(0, 5).map((article) => ({
      title: article.title,
      slug: article.slug,
      publishedAt: article.publishedAt,
      categoryName: article.categoryName,
    })),
    failures: logs
      .filter((log) => log.status === 'failed')
      .slice(0, 10)
      .map((log) => ({
        sourceName: log.sourceName,
        url: log.url,
        message: log.message,
      })),
  }
}
