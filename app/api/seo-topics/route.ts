import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import type { SeoTopic } from '../../lib/seo-topics'

const SEO_TOPICS_PATH = path.join(process.cwd(), 'data', 'seo-topics.json')

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
    const fileContent = fs.readFileSync(SEO_TOPICS_PATH, 'utf-8')
    return NextResponse.json(JSON.parse(fileContent))
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

    const dataDir = path.dirname(SEO_TOPICS_PATH)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    fs.writeFileSync(SEO_TOPICS_PATH, `${JSON.stringify(normalized, null, 2)}\n`, 'utf-8')
    return NextResponse.json({ success: true, topics: normalized })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to write SEO topics', details: String(error) },
      { status: 500 }
    )
  }
}
