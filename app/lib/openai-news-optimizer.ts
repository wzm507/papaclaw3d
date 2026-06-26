import type { NewsArticle } from './news-types'

interface OptimizedNewsPayload {
  searchableTitle?: string
  aiSummary?: string
  keywords?: string[]
}

function extractTextFromResponse(payload: any): string {
  if (typeof payload.output_text === 'string') return payload.output_text

  const chunks: string[] = []
  for (const item of payload.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === 'string') chunks.push(content.text)
    }
  }
  return chunks.join('\n')
}

export async function optimizeNewsWithOpenAI(article: NewsArticle): Promise<NewsArticle> {
  if (!process.env.OPENAI_API_KEY) return article

  const model = process.env.OPENAI_NEWS_MODEL || 'gpt-5.5'
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: 'system',
          content:
            '你是 Papa Claw爬爬虾官网新闻编辑。保留原文事实，不夸大承诺，不宣称百分百中标、保证订单或保证收录。只输出 JSON。',
        },
        {
          role: 'user',
          content: JSON.stringify({
            task: '为官网新闻生成便于搜索引擎和问答类 AI 理解的标题、摘要和关键词。不要改写原文正文。',
            brand: 'Papa Claw爬爬虾，结合 AI 数据能力、南沙港澳资源和中东经验，服务企业出海落地。',
            article: {
              title: article.title,
              categoryName: article.categoryName,
              summary: article.summary,
              contentText: article.contentText.slice(0, 6000),
            },
            outputShape: {
              searchableTitle: 'string',
              aiSummary: 'string',
              keywords: ['string'],
            },
          }),
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'news_ai_metadata',
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              searchableTitle: { type: 'string' },
              aiSummary: { type: 'string' },
              keywords: {
                type: 'array',
                items: { type: 'string' },
              },
            },
            required: ['searchableTitle', 'aiSummary', 'keywords'],
          },
          strict: true,
        },
      },
    }),
    cache: 'no-store',
  })

  if (!response.ok) return article

  try {
    const payload = await response.json()
    const text = extractTextFromResponse(payload)
    const optimized = JSON.parse(text) as OptimizedNewsPayload

    return {
      ...article,
      searchableTitle: optimized.searchableTitle || article.searchableTitle,
      aiSummary: optimized.aiSummary || article.aiSummary,
      keywords: Array.from(new Set([...(optimized.keywords || []), ...article.keywords])).slice(0, 14),
    }
  } catch {
    return article
  }
}
