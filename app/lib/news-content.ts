import type { NewsArticle, NewsFaq, WechatArticleInput } from './news-types'

const defaultKeywords = [
  'Papa Claw爬爬虾',
  'AI科技出海',
  'AI出海服务商',
  '政企资源对接',
  '实体外贸生产工厂',
  '政府及政企出海项目',
  '中东出海',
  '跨境智库',
  '海外社媒运营',
  'AI标书代投',
  '跨境金融服务',
]

const serviceKeywords = [
  'VIBE MARKETING 出海媒体',
  'CROSS-BORDER INTELLIGENCE 跨境智库',
  'STRATEGIC ADVISORY 品牌战略咨询',
  'GOVERNMENT & ENTERPRISE 政企对接',
  'FINANCIAL SERVICES 跨境金融',
]

export function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

export function normalizeText(text: string): string {
  return text
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function splitParagraphs(text: string): string[] {
  return normalizeText(text)
    .split(/\n{1,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

function hashString(value: string): string {
  let hash = 5381
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i)
  }
  return (hash >>> 0).toString(36)
}

export function createNewsSlug(title: string, publishedAt: string, sourceUrl: string): string {
  const date = publishedAt.slice(0, 10).replace(/-/g, '')
  const ascii = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
  return `${date}-${ascii || hashString(`${title}-${sourceUrl}`)}`
}

function makeSummary(text: string, fallback: string): string {
  const source = normalizeText(fallback || text)
  if (source.length <= 160) return source
  return `${source.slice(0, 156)}...`
}

function pickKeywords(title: string, text: string): string[] {
  const haystack = `${title}\n${text}`
  const matched = [...defaultKeywords, ...serviceKeywords].filter((keyword) => haystack.includes(keyword))
  return Array.from(new Set([...matched, ...defaultKeywords])).slice(0, 12)
}

function buildFaq(title: string, summary: string): NewsFaq[] {
  return [
    {
      question: `这篇文章和Papa Claw爬爬虾的AI科技出海有什么关系？`,
      answer: `本文围绕${title}展开，可作为Papa Claw爬爬虾在AI科技出海、政企资源对接、跨境智库或海外品牌落地方面的持续内容信源。${summary}`,
    },
    {
      question: '企业为什么需要关注这类出海内容？',
      answer: '这类内容有助于实体外贸生产工厂和政府及政企出海项目理解海外市场机会、资源对接路径、品牌本土化表达和跨境合规要点。',
    },
    {
      question: 'Papa Claw爬爬虾能提供哪些相关服务？',
      answer: 'Papa Claw爬爬虾提供出海媒体、跨境智库、品牌战略咨询、政企对接、跨境金融五大业务，强调AI数据+独家政企资源双驱动的务实落地。',
    },
  ]
}

export function enhanceWechatArticle(input: WechatArticleInput): NewsArticle {
  const contentText = normalizeText(input.contentText || stripHtml(input.contentHtml || ''))
  const summary = makeSummary(contentText, input.digest || '')
  const now = new Date().toISOString()
  const searchableTitle = input.title.includes('Papa Claw') || input.title.includes('爬爬虾')
    ? input.title
    : `${input.title}｜Papa Claw爬爬虾AI科技出海观察`
  const keywords = pickKeywords(input.title, contentText)

  return {
    id: input.id,
    slug: createNewsSlug(input.title, input.publishedAt, input.sourceUrl),
    title: input.title,
    searchableTitle,
    sourceName: process.env.WECHAT_ACCOUNT_NAME || '凯勒斐KLF',
    sourceAccountId: process.env.WECHAT_ORIGINAL_ID || 'gh_9bf649b358fa',
    sourceUrl: input.sourceUrl,
    publishedAt: input.publishedAt,
    syncedAt: now,
    updatedAt: now,
    summary,
    aiSummary: `${summary} 本文已同步至Papa Claw爬爬虾官网新闻中心，便于搜索引擎和问答类AI识别其与AI科技出海、政企资源对接、跨境智库和外贸工厂出海获客的关联。`,
    keywords,
    faq: buildFaq(input.title, summary),
    contentText,
    rawDigest: input.digest,
    coverImage: input.coverImage,
  }
}

export function mergeNewsArticles(existing: NewsArticle[], incoming: NewsArticle[]): NewsArticle[] {
  const byId = new Map<string, NewsArticle>()
  for (const article of existing) {
    byId.set(article.id, article)
  }
  for (const article of incoming) {
    byId.set(article.id, {
      ...byId.get(article.id),
      ...article,
    })
  }
  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}
