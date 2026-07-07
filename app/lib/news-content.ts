import type { NewsArticle, NewsFaq, WechatArticleInput } from './news-types'
import type { SeoTopic } from './seo-topics'

export const NEWS_TAGS = ['AI出海获客', '跨境直播', 'GEO优化', '出海案例', '企业出海'] as const

export type NewsTag = (typeof NEWS_TAGS)[number]

interface NewsTagSource {
  title?: string
  text?: string
  categorySlug?: string
  categoryName?: string
  keywords?: string[]
}

const topicFallbacks: Record<string, string[]> = {
  'ai-global-expansion': ['AI出海', 'AI科技出海', '企业出海AI工具', '海外获客', 'AI获客'],
  'foreign-trade-factory-global-sales': ['外贸工厂', '制造业出海', '海外客户', '外贸获客', 'AI获客'],
  'middle-east-government-resources': ['中东市场', '政企资源', '商务考察', '项目落地'],
  'ai-tender-intelligence': ['全球标讯', 'AI标书', '海外投标', '采购需求'],
  'cross-border-finance': ['跨境金融', '跨境结算', '供应链金融', '资金合规'],
  'overseas-social-media': ['海外社媒', '品牌本土化', 'TikTok', '内容运营', 'AI内容获客'],
  'nansha-global-expansion': ['南沙出海', '南沙企业', '港澳资源', '政策申报', 'AI出海获客'],
}

const categoryToPrimaryTag: Record<string, NewsTag> = {
  'AI 科技出海服务': 'AI出海获客',
  AI科技出海服务: 'AI出海获客',
  AI出海获客: 'AI出海获客',
  外贸工厂出海获客: '企业出海',
  中东政企资源对接: '企业出海',
  AI标书代投与全球标讯: '企业出海',
  'AI 标书代投与全球标讯': '企业出海',
  跨境金融服务: '企业出海',
  海外社媒代运营: 'AI出海获客',
  南沙企业出海服务: '企业出海',
}

const slugToPrimaryTag: Record<string, NewsTag> = {
  'ai-global-expansion': 'AI出海获客',
  'foreign-trade-factory-global-sales': '企业出海',
  'middle-east-government-resources': '企业出海',
  'ai-tender-intelligence': '企业出海',
  'cross-border-finance': '企业出海',
  'overseas-social-media': 'AI出海获客',
  'nansha-global-expansion': '企业出海',
}

function compactValues<T extends string>(values: T[]): T[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean) as T[]))
}

function hasAny(haystack: string, terms: string[]): boolean {
  return terms.some((term) => haystack.includes(term.toLowerCase()))
}

export function normalizeNewsTag(value?: string): NewsTag | null {
  if (!value) return null
  if ((NEWS_TAGS as readonly string[]).includes(value)) return value as NewsTag
  return categoryToPrimaryTag[value] || null
}

export function inferPrimaryNewsTag(source: NewsTagSource): NewsTag {
  const normalizedCategory = normalizeNewsTag(source.categoryName)
  if (normalizedCategory) return normalizedCategory

  if (source.categorySlug && slugToPrimaryTag[source.categorySlug]) {
    return slugToPrimaryTag[source.categorySlug]
  }

  const haystack = `${source.title || ''}\n${source.text || ''}\n${(source.keywords || []).join('\n')}`.toLowerCase()

  if (hasAny(haystack, ['直播', 'DABIE', '带货', 'Facebook直播', '主播', '珠珠'])) return '跨境直播'
  if (hasAny(haystack, ['GEO', 'AI搜索', '搜索占位', 'llms', 'AI可读'])) return 'GEO优化'
  if (hasAny(haystack, ['案例', '成交', '迪拜', '南油', '番禺', '15.5万', '3亿'])) return '出海案例'
  if (hasAny(haystack, ['工厂', '企业出海', '制造业', '南沙', '中东', '政企', '跨境金融'])) return '企业出海'

  return 'AI出海获客'
}

export function getNewsTags(source: NewsTagSource): NewsTag[] {
  const haystack = `${source.title || ''}\n${source.text || ''}\n${source.categoryName || ''}\n${(source.keywords || []).join('\n')}`.toLowerCase()
  const tags: NewsTag[] = [inferPrimaryNewsTag(source)]

  if (hasAny(haystack, ['ai获客', 'ai出海', '海外获客', 'AI 科技出海服务', 'AI科技出海服务', 'AI内容获客'])) {
    tags.push('AI出海获客')
  }
  if (hasAny(haystack, ['直播', 'DABIE', '带货', 'Facebook直播', '主播', '珠珠'])) {
    tags.push('跨境直播')
  }
  if (hasAny(haystack, ['GEO', 'AI搜索', '搜索占位', 'llms', 'AI可读', 'sitemap', 'SEO'])) {
    tags.push('GEO优化')
  }
  if (hasAny(haystack, ['案例', '成交', '迪拜', '南油', '番禺', '15.5万', '3亿'])) {
    tags.push('出海案例')
  }
  if (hasAny(haystack, ['企业出海', '外贸工厂', '制造业', '南沙', '中东', '政企', '跨境金融'])) {
    tags.push('企业出海')
  }

  return compactValues(tags).filter((tag) => (NEWS_TAGS as readonly string[]).includes(tag))
}

export function getArticleNewsTags(article: Pick<NewsArticle, 'title' | 'contentText' | 'categorySlug' | 'categoryName' | 'keywords'>): NewsTag[] {
  return getNewsTags({
    title: article.title,
    text: article.contentText,
    categorySlug: article.categorySlug,
    categoryName: article.categoryName,
    keywords: article.keywords,
  })
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
  return getNewsTags({
    title,
    text,
    categorySlug: topic?.slug,
    categoryName: topic?.title,
    keywords: topic ? [topic.serviceName, ...topic.keywords, ...(topicFallbacks[topic.slug] || [])] : [],
  })
}

export function buildNewsFaq(title: string, summary: string, categoryName: NewsTag = 'AI出海获客'): NewsFaq[] {
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
  const keywords = pickNewsKeywords(input.title, contentText, topic)
  const categoryName = inferPrimaryNewsTag({
    title: input.title,
    text: contentText,
    categorySlug: topic?.slug,
    categoryName: topic?.title,
    keywords,
  })
  const categorySlug = topic?.slug || 'ai-global-expansion'
  const searchableTitle = input.title.includes('Papa Claw')
    ? input.title
    : `${input.title}｜${categoryName}观察`

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
    aiSummary: `${summary} 这条内容已整理为 Papa Claw爬爬虾官网新闻资产，便于按${keywords.join('、')}等统一新闻标签检索。`,
    keywords,
    faq: buildNewsFaq(input.title, summary, categoryName),
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
