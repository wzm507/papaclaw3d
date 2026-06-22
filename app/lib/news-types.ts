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
