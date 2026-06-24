import { NextResponse } from 'next/server'
import { submitIndexNowUrls } from '../../lib/indexnow'
import { listSeoTopics, saveSeoTopics } from '../../lib/seo-topics'
import type { SeoTopic } from '../../lib/seo-topics'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeList(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map((item) => String(item).trim()).filter(Boolean)
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.papaclaw.cn').replace(/\/$/, '')
}

function normalizeTopics(topics: Partial<SeoTopic>[]): SeoTopic[] {
  return topics
    .map((topic) => ({
      slug: normalizeSlug(topic.slug || ''),
      title: String(topic.title || '').trim(),
      metaTitle: String(topic.metaTitle || topic.title || '').trim(),
      description: String(topic.description || '').trim(),
      keywords: normalizeList(topic.keywords),
      serviceName: String(topic.serviceName || topic.title || '').trim(),
      audience: normalizeList(topic.audience),
      problems: normalizeList(topic.problems),
      papaClawAdvantages: normalizeList(topic.papaClawAdvantages),
      process: normalizeList(topic.process),
      faq: Array.isArray(topic.faq)
        ? topic.faq
            .map((item) => ({
              question: String(item.question || '').trim(),
              answer: String(item.answer || '').trim(),
            }))
            .filter((item) => item.question && item.answer)
        : [],
    }))
    .filter((topic) => topic.slug && topic.title)
}

export async function GET() {
  try {
    return NextResponse.json(await listSeoTopics())
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read SEO topics', details: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'SEO topics payload must be an array' }, { status: 400 })
    }

    const normalized = normalizeTopics(body)
    const slugs = new Set<string>()
    for (const topic of normalized) {
      if (slugs.has(topic.slug)) {
        return NextResponse.json({ error: `Duplicate slug: ${topic.slug}` }, { status: 400 })
      }
      slugs.add(topic.slug)
    }

    await saveSeoTopics(normalized)

    let indexNow: { ok: boolean; status: number; submitted: number } | null = null
    try {
      const baseUrl = siteUrl()
      const result = await submitIndexNowUrls([
        baseUrl,
        `${baseUrl}/sitemap.xml`,
        `${baseUrl}/llms.txt`,
        `${baseUrl}/llms-full.txt`,
        ...normalized.map((topic) => `${baseUrl}/${topic.slug}`),
      ])
      indexNow = {
        ok: result.ok,
        status: result.status,
        submitted: result.submitted,
      }
    } catch {
      indexNow = {
        ok: false,
        status: 0,
        submitted: 0,
      }
    }

    return NextResponse.json({ success: true, topics: normalized, indexNow })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to write SEO topics', details: String(error) },
      { status: 500 }
    )
  }
}
