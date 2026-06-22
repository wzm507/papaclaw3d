import { NextResponse } from 'next/server'
import { listNewsArticles } from '../../lib/news-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const articles = await listNewsArticles()
  return NextResponse.json({
    data: articles.map(({ contentText, ...article }) => ({
      ...article,
      contentLength: contentText.length,
    })),
  })
}

