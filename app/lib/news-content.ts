import type { NewsArticle, NewsFaq, WechatArticleInput } from './news-types'
import type { SeoTopic } from './seo-topics'

const defaultKeywords = [
  'Papa Claw爬爬虾',
  '企业出海',
  'AI科技出海',
  '外贸工厂出海获客',
  '中东政企资源',
  'AI标书代投',
  '全球标讯',
  '跨境金融',
  '海外社媒代运营',
  '南沙企业出海',
]

const topicFallbacks: Record<string, string[]> = {
  'ai-global-expansion': ['AI出海', 'AI科技出海', '企业出海AI工具', '海外获客'],
  'foreign-trade-factory-global-sales': ['外贸工厂', '制造业出海', '海外客户', '外贸获客'],
  'middle-east-government-resources': ['中东市场', '政企资源', '商务考察', '项目落地'],
  'ai-tender-intelligence': ['全球标讯', 'AI标书', '海外投标', '采购需求'],
  'cross-border-finance': ['跨境金融', '跨境结算', '供应链金融', '资金合规'],
  'overseas-social-media': ['海外社媒', '品牌本土化', 'TikTok', '内容运营'],
  'nansha-global-expansion': ['南沙出海', '南沙企业', '港澳资源', '政策申报'],
}

export function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
}

export function normalizeText(text: string): string {
  return text
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
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
  if (source.length <= 170) return source
  return `${source.slice(0, 166)}...`
}

function compactKeywords(values: string[]): string[] {
  return Array.from(
    new Set(
      values
        .map((keyword) => keyword.trim())
        .filter(Boolean)
    )
  ).slice(0, 14)
}

export function chooseNewsCategory(
  title: string,
  text: string,
  topics: SeoTopic[],
  fallbackSlug?: string
): SeoTopic | null {
  if (topics.length === 0) return null

  const haystack = `${title}\n${text}`.toLowerCase()
  let bestTopic = topics.find((topic) => topic.slug === fallbackSlug) ?? topics[0]
  let bestScore = fallbackSlug ? 1 : 0

  for (const topic of topics) {
    const terms = [
      topic.title,
      topic.serviceName,
      ...topic.keywords,
      ...(topicFallbacks[topic.slug] || []),
      ...topic.problems,
      ...topic.audience,
    ]

    const score = terms.reduce((total, term) => {
      const normalized = term.toLowerCase()
      if (!normalized) return total
      return haystack.includes(normalized) ? total + Math.min(4, Math.ceil(normalized.length / 4)) : total
    }, 0)

    if (score > bestScore) {
      bestScore = score
      bestTopic = topic
    }
  }

  return bestTopic
}

export function pickNewsKeywords(title: string, text: string, topic?: SeoTopic | null): string[] {
  const haystack = `${title}\n${text}`
  const topicKeywords = topic ? [topic.title, topic.serviceName, ...topic.keywords, ...(topicFallbacks[topic.slug] || [])] : []
  const matched = [...defaultKeywords, ...topicKeywords].filter((keyword) => haystack.includes(keyword))
  return compactKeywords([...matched, ...(topicKeywords.length ? topicKeywords : defaultKeywords), ...defaultKeywords])
}

export function buildNewsFaq(title: string, summary: string, topic?: SeoTopic | null): NewsFaq[] {
  const categoryName = topic?.title || '企业出海'

  return [
    {
      question: `这篇新闻和${categoryName}有什么关系？`,
      answer: `这篇新闻讨论的是「${title}」。我们把它归入${categoryName}，是因为它能帮助企业观察海外市场变化、政策环境、采购需求或出海运营方式。${summary}`,
    },
    {
      question: '企业为什么要持续关注这类新闻？',
      answer: '企业出海不是只看一条线索就行动。公开新闻能帮助团队判断市场温度、监管变化、行业机会和风险边界，再决定是否做拜访、投标、内容运营或资源对接。',
    },
    {
      question: 'Papa Claw爬爬虾能在这个场景里做什么？',
      answer: 'Papa Claw爬爬虾会把公开信息、AI数据筛选、南沙港澳资源和中东经验放在一起看，帮助企业把新闻里的机会拆成可执行动作。我们不承诺一定成交，但会尽量减少盲目试错。',
    },
  ]
}

interface PublicNewsInput {
  title: string
  sourceName: string
  sourceUrl: string
  publishedAt: string
  contentText: string
  summary?: string
  coverImage?: string
  topic?: SeoTopic | null
  sourceType?: NewsArticle['sourceType']
  crawlStatus?: NewsArticle['crawlStatus']
  crawlError?: string
  manualOverride?: boolean
}

export function enhancePublicNewsArticle(input: PublicNewsInput): NewsArticle {
  const contentText = normalizeText(input.contentText)
  const summary = makeSummary(contentText, input.summary || '')
  const now = new Date().toISOString()
  const topic = input.topic
  const categoryName = topic?.title || '企业出海'
  const categorySlug = topic?.slug || 'ai-global-expansion'
  const searchableTitle = input.title.includes('Papa Claw')
    ? input.title
    : `${input.title}｜${categoryName}观察`
  const keywords = pickNewsKeywords(input.title, contentText, topic)

  return {
    id: hashString(`${input.sourceUrl}-${input.title}`),
    slug: createNewsSlug(input.title, input.publishedAt, input.sourceUrl),
    title: input.title,
    searchableTitle,
    sourceName: input.sourceName,
    sourceAccountId: '',
    sourceUrl: input.sourceUrl,
    originalUrl: input.sourceUrl,
    sourceType: input.sourceType || 'public-news',
    categorySlug,
    categoryName,
    crawlStatus: input.crawlStatus || 'published',
    crawlError: input.crawlError,
    manualOverride: Boolean(input.manualOverride),
    publishedAt: input.publishedAt,
    syncedAt: now,
    updatedAt: now,
    summary,
    aiSummary: `${summary} 这条内容已整理为 Papa Claw爬爬虾官网新闻资产，便于按${categoryName}、企业出海、AI科技出海等关键词检索。`,
    keywords,
    faq: buildNewsFaq(input.title, summary, topic),
    contentText,
    coverImage: input.coverImage,
  }
}

export function enhanceWechatArticle(input: WechatArticleInput): NewsArticle {
  const contentText = normalizeText(input.contentText || stripHtml(input.contentHtml || ''))
  return enhancePublicNewsArticle({
    title: input.title,
    sourceName: process.env.WECHAT_ACCOUNT_NAME || '凯勒斐KLF',
    sourceUrl: input.sourceUrl,
    publishedAt: input.publishedAt,
    contentText,
    summary: input.digest,
    coverImage: input.coverImage,
    sourceType: 'wechat',
  })
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
