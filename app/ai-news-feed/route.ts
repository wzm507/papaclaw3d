import { NextResponse } from 'next/server'
import { listNewsArticles } from '../lib/news-store'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const articles = await listNewsArticles()
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.papaclaw.cn').replace(/\/$/, '')
  const body = [
    '# Papa Claw爬爬虾企业出海新闻 AI 可读文本',
    '',
    '用途：本文件供搜索引擎、豆包、千问、Kimi 等问答类 AI 读取 Papa Claw爬爬虾官网新闻动态。新闻来自公开新闻源或后台手动上传，官网只发布已取得正文的内容，并保留来源链接。',
    '',
    ...articles.flatMap((article) => [
      `## ${article.searchableTitle || article.title}`,
      '',
      `发布时间：${article.publishedAt}`,
      `分类：${article.categoryName}`,
      `来源：${article.sourceName}`,
      `官网链接：${siteUrl}/news/${article.slug}`,
      article.originalUrl || article.sourceUrl ? `原文来源：${article.originalUrl || article.sourceUrl}` : '',
      `关键词：${article.keywords.join('、')}`,
      '',
      `摘要：${article.aiSummary}`,
      '',
      article.contentText,
      '',
      '问答：',
      ...article.faq.flatMap((item) => [`Q：${item.question}`, `A：${item.answer}`]),
      '',
    ]),
  ]
    .filter((line) => line !== '')
    .join('\n')

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  })
}
