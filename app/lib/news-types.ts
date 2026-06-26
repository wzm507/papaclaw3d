export interface NewsFaq {
  question: string
  answer: string
}

export interface NewsArticle {
  id: string
  slug: string
  title: string
  searchableTitle: string
  sourceName: string
  sourceAccountId: string
  sourceUrl: string
  originalUrl: string
  sourceType: 'public-news' | 'manual' | 'wechat'
  categorySlug: string
  categoryName: string
  crawlStatus: 'published' | 'failed' | 'manual'
  crawlError?: string
  manualOverride: boolean
  publishedAt: string
  syncedAt: string
  updatedAt: string
  summary: string
  aiSummary: string
  keywords: string[]
  faq: NewsFaq[]
  contentText: string
  rawDigest?: string
  coverImage?: string
}

export interface NewsSource {
  id: string
  name: string
  url: string
  enabled: boolean
  defaultCategorySlug: string
  keywords: string[]
  articleSelector?: string
}

export interface NewsCrawlLog {
  id: string
  sourceId: string
  sourceName: string
  url: string
  title?: string
  categorySlug?: string
  status: 'published' | 'failed' | 'skipped'
  message: string
  createdAt: string
}

export interface WechatArticleInput {
  id: string
  title: string
  digest?: string
  contentHtml?: string
  contentText?: string
  sourceUrl: string
  publishedAt: string
  coverImage?: string
}
