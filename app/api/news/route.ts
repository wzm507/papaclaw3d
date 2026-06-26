import { NextResponse } from 'next/server'
import { deleteNewsArticle, listNewsArticles } from '../../lib/news-store'
import { listNewsCrawlLogs } from '../../lib/news-sources'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const category = url.searchParams.get('category')
  const articles = await listNewsArticles()
  const filtered = category ? articles.filter((article) => article.categorySlug === category) : articles
  const logs = await listNewsCrawlLogs()

  return NextResponse.json({
    data: filtered.map(({ contentText, ...article }) => ({
      ...article,
      contentLength: contentText.length,
    })),
    logs: logs.slice(0, 30),
  })
}

export async function DELETE(request: Request) {
  const url = new URL(request.url)
  const slug = url.searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
  }

  const next = await deleteNewsArticle(slug)
  return NextResponse.json({ ok: true, count: next.length })
}
