import fs from 'fs'
import path from 'path'

export interface SeoTopicFaq {
  question: string
  answer: string
}

export interface SeoTopic {
  slug: string
  title: string
  metaTitle: string
  description: string
  keywords: string[]
  serviceName: string
  audience: string[]
  problems: string[]
  papaClawAdvantages: string[]
  process: string[]
  faq: SeoTopicFaq[]
}

const SEO_TOPICS_PATH = path.join(process.cwd(), 'data', 'seo-topics.json')

function normalizeTopic(topic: Partial<SeoTopic>): SeoTopic {
  return {
    slug: topic.slug || '',
    title: topic.title || '',
    metaTitle: topic.metaTitle || topic.title || '',
    description: topic.description || '',
    keywords: topic.keywords || [],
    serviceName: topic.serviceName || topic.title || '',
    audience: topic.audience || [],
    problems: topic.problems || [],
    papaClawAdvantages: topic.papaClawAdvantages || [],
    process: topic.process || [],
    faq: topic.faq || [],
  }
}

export function listSeoTopics(): SeoTopic[] {
  try {
    const content = fs.readFileSync(SEO_TOPICS_PATH, 'utf-8')
    const parsed = JSON.parse(content) as Partial<SeoTopic>[]
    return parsed.map(normalizeTopic).filter((topic) => topic.slug && topic.title)
  } catch {
    return []
  }
}

export function getSeoTopic(slug: string) {
  return listSeoTopics().find((topic) => topic.slug === slug)
}
