import { NextResponse } from 'next/server'
import { listNewsCrawlLogs, listNewsSources, saveNewsSources } from '../../lib/news-sources'
import type { NewsSource } from '../../lib/news-types'

export const dynamic = 'force-dynamic'

export async function GET() {
  const [sources, logs] = await Promise.all([listNewsSources(), listNewsCrawlLogs()])
  return NextResponse.json({ data: sources, logs: logs.slice(0, 50) })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const sources = (Array.isArray(body) ? body : body.sources) as NewsSource[]

    if (!Array.isArray(sources)) {
      return NextResponse.json({ error: 'sources must be an array' }, { status: 400 })
    }

    await saveNewsSources(sources)
    return NextResponse.json({ ok: true, data: await listNewsSources() })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown news source error'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
