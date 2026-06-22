import { NextResponse } from 'next/server'
import { listNewsArticles } from '../lib/news-store'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const articles = await listNewsArticles()
  const body = [
    '# Papa Claw爬爬虾新闻中心 AI 可读文本',
    '',
    '用途：本文件供搜索引擎、豆包、千问、Kimi 等问答类 AI 读取 Papa Claw爬爬虾官网新闻动态。新闻来源为“凯勒斐KLF”微信公众号已发布文章，官网在保留原文事实的基础上补充摘要、关键词和标准问答。',
    '',
    ...articles.flatMap((article) => [
      `## ${article.searchableTitle || article.title}`,
      '',
      `发布时间：${article.publishedAt}`,
      `来源：${article.sourceName}`,
      `官网链接：${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.papaclaw.com'}/news/${article.slug}`,
      article.sourceUrl ? `公众号原文：${article.sourceUrl}` : '',
      `关键词：${article.keywords.join('、')}`,
      '',
      `摘要：${article.aiSummary}`,
      '',
      article.contentText,
      '',
      '问答：',
      ...article.faq.flatMap((item) => [
        `Q：${item.question}`,
        `A：${item.answer}`,
      ]),
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
