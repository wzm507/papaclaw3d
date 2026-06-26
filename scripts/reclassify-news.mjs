import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const newsPath = path.join(__dirname, '..', 'data', 'news.json')

const CATEGORY_RULES = [
  {
    slug: 'cross-border-finance',
    title: '跨境金融服务',
    baseScore: 0,
    keywords: [
      { word: '上市', weight: 14 }, { word: 'IPO', weight: 14 }, { word: '纳斯达克', weight: 14 }, { word: '港股', weight: 14 }, { word: 'A股', weight: 12 },
      { word: '并购', weight: 12 }, { word: '跨境结算', weight: 12 }, { word: '供应链金融', weight: 12 }, { word: '外汇', weight: 11 }, { word: '汇率', weight: 11 },
      { word: '信托', weight: 11 }, { word: '证券', weight: 11 }, { word: '保险', weight: 11 }, { word: '银行理财', weight: 11 }, { word: '增资', weight: 10 },
      { word: '融资', weight: 8 }, { word: '投资', weight: 7 }, { word: '金融', weight: 9 }, { word: '资金', weight: 7 }, { word: '回款', weight: 8 },
      { word: '信贷', weight: 8 }, { word: '贷款', weight: 8 }, { word: '估值', weight: 8 }, { word: '美元', weight: 5 }, { word: '募资', weight: 8 },
      { word: '定增', weight: 10 }, { word: '发债', weight: 10 }, { word: '基金', weight: 6 }, { word: '存托股份', weight: 12 }, { word: 'ADS', weight: 12 },
    ],
  },
  {
    slug: 'middle-east-government-resources',
    title: '中东政企资源对接',
    baseScore: 0,
    keywords: [
      { word: '中东', weight: 14 }, { word: '沙特', weight: 14 }, { word: '阿联酋', weight: 14 }, { word: '迪拜', weight: 13 }, { word: '阿布扎比', weight: 13 },
      { word: '利雅得', weight: 13 }, { word: '政企', weight: 11 }, { word: '政府', weight: 9 }, { word: '官方', weight: 9 }, { word: '拜会', weight: 10 },
      { word: '考察', weight: 9 }, { word: '商务考察', weight: 11 }, { word: '使馆', weight: 10 }, { word: '领事馆', weight: 10 }, { word: '商会', weight: 9 },
      { word: '自贸区', weight: 9 }, { word: '主权基金', weight: 12 }, { word: 'PIF', weight: 12 }, { word: '愿景2030', weight: 12 }, { word: 'NEOM', weight: 12 },
    ],
  },
  {
    slug: 'ai-tender-intelligence',
    title: 'AI 标书代投与全球标讯',
    baseScore: 0,
    keywords: [
      { word: '标书', weight: 14 }, { word: '投标', weight: 14 }, { word: '招标', weight: 14 }, { word: '标讯', weight: 14 }, { word: '政府采购', weight: 13 },
      { word: '项目中标', weight: 13 }, { word: '中标', weight: 12 }, { word: '招标文件', weight: 12 }, { word: '投标文件', weight: 12 }, { word: '采购', weight: 7 },
      { word: '竞标', weight: 11 }, { word: 'tender', weight: 12 }, { word: 'bid', weight: 10 }, { word: 'procurement', weight: 11 }, { word: 'rfp', weight: 11 },
    ],
  },
  {
    slug: 'overseas-social-media',
    title: '海外社媒代运营',
    baseScore: 0,
    keywords: [
      { word: '社媒', weight: 12 }, { word: '社交媒体', weight: 12 }, { word: '海外社媒', weight: 14 }, { word: 'TikTok', weight: 10 }, { word: 'LinkedIn', weight: 10 },
      { word: 'Instagram', weight: 10 }, { word: 'Facebook', weight: 10 }, { word: 'Twitter', weight: 9 }, { word: 'YouTube', weight: 9 }, { word: '内容营销', weight: 12 },
      { word: '网红', weight: 11 }, { word: 'KOL', weight: 11 }, { word: '达人', weight: 10 }, { word: '种草', weight: 11 }, { word: '直播', weight: 9 },
      { word: '短视频', weight: 9 }, { word: '代运营', weight: 13 }, { word: '品牌出海', weight: 8 }, { word: '曝光', weight: 8 }, { word: '粉丝', weight: 8 },
      { word: '账号运营', weight: 11 },
    ],
    antiKeywords: ['工厂', '制造', '产能', 'OEM', '代工', '产品出海', '糖果', '食品'],
  },
  {
    slug: 'nansha-global-expansion',
    title: '南沙企业出海服务',
    baseScore: 0,
    keywords: [
      { word: '南沙', weight: 15 }, { word: '大湾区', weight: 12 }, { word: '港澳', weight: 10 }, { word: '横琴', weight: 10 }, { word: '前海', weight: 10 },
      { word: '南沙企业', weight: 15 }, { word: '粤港澳大湾区', weight: 13 }, { word: '广东企业', weight: 8 }, { word: '广州', weight: 5 }, { word: '深圳', weight: 5 },
    ],
  },
  {
    slug: 'foreign-trade-factory-global-sales',
    title: '外贸工厂出海获客',
    baseScore: 0,
    keywords: [
      { word: '工厂', weight: 11 }, { word: '制造', weight: 10 }, { word: '外贸', weight: 12 }, { word: '出口', weight: 11 }, { word: '订单', weight: 10 },
      { word: '产能', weight: 11 }, { word: 'OEM', weight: 11 }, { word: 'ODM', weight: 11 }, { word: '代工', weight: 11 }, { word: '供应链', weight: 9 },
      { word: '采购商', weight: 11 }, { word: '询盘', weight: 12 }, { word: '海外客户', weight: 12 }, { word: '跨境电商', weight: 10 }, { word: '亚马逊', weight: 9 },
      { word: '速卖通', weight: 9 }, { word: 'SHEIN', weight: 9 }, { word: 'Temu', weight: 9 }, { word: 'Shopee', weight: 9 }, { word: 'Lazada', weight: 9 },
      { word: '外贸企业', weight: 12 }, { word: '生产商', weight: 11 }, { word: '厂家', weight: 10 }, { word: '产品出海', weight: 12 }, { word: '品牌出海', weight: 10 },
      { word: '中国品牌', weight: 10 }, { word: '美国市场', weight: 9 }, { word: '海外市场', weight: 8 }, { word: '出海美国', weight: 11 }, { word: '走进美国', weight: 10 },
      { word: '零售', weight: 8 }, { word: '渠道', weight: 8 }, { word: 'Costco', weight: 9 }, { word: '山姆', weight: 9 }, { word: '沃尔玛', weight: 9 },
      { word: '超市', weight: 7 }, { word: '门店', weight: 7 }, { word: '销量', weight: 8 }, { word: '销售额', weight: 8 }, { word: '年入', weight: 8 },
      { word: '营收', weight: 7 }, { word: '糖果', weight: 8 }, { word: '食品', weight: 8 }, { word: '饮料', weight: 8 }, { word: '美妆', weight: 8 },
      { word: '个护', weight: 8 }, { word: '消费电子', weight: 9 }, { word: '出海品牌', weight: 10 },
    ],
  },
  {
    slug: 'ai-global-expansion',
    title: 'AI 科技出海服务',
    baseScore: 0,
    keywords: [
      { word: 'AI', weight: 10 }, { word: '人工智能', weight: 11 }, { word: '科技', weight: 7 }, { word: '大模型', weight: 12 }, { word: '模型', weight: 7 },
      { word: '芯片', weight: 10 }, { word: '算法', weight: 9 }, { word: '数字化', weight: 8 }, { word: 'SaaS', weight: 10 }, { word: '云计算', weight: 9 },
      { word: '机器人', weight: 9 }, { word: '具身智能', weight: 11 }, { word: '自动驾驶', weight: 10 }, { word: '智能硬件', weight: 9 }, { word: 'OpenAI', weight: 10 },
      { word: 'DeepSeek', weight: 10 }, { word: 'Anthropic', weight: 10 }, { word: 'Claude', weight: 9 }, { word: 'ChatGPT', weight: 9 }, { word: '独角兽', weight: 7 },
      { word: '科技企业', weight: 8 }, { word: '互联网', weight: 6 }, { word: '软件', weight: 6 }, { word: '出海服务', weight: 7 },
    ],
  },
]

function classifyNews(title, summary) {
  const text = `${title}\n${summary}`
  const normalizedText = text.toLowerCase()
  const normalizedTitle = title.toLowerCase()

  const scores = CATEGORY_RULES.map((rule) => {
    let score = rule.baseScore || 0

    for (const { word, weight } of rule.keywords) {
      const wordLower = word.toLowerCase()
      const escaped = wordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const count = (normalizedText.match(new RegExp(escaped, 'g')) || []).length
      if (count > 0) {
        const titleMultiplier = normalizedTitle.includes(wordLower) ? 1.6 : 1
        score += weight * count * titleMultiplier
      }
    }

    if (rule.antiKeywords) {
      for (const anti of rule.antiKeywords) {
        if (normalizedText.includes(anti.toLowerCase())) {
          score -= 15
        }
      }
    }

    return { slug: rule.slug, title: rule.title, score }
  })

  const winner = scores.reduce((best, current) => (current.score > best.score ? current : best), scores[0])

  if (winner.score < 8) {
    const fallback = CATEGORY_RULES.find((r) => r.slug === 'ai-global-expansion')
    return { slug: fallback.slug, title: fallback.title, score: winner.score }
  }

  return winner
}

async function main() {
  const newsContent = await fs.readFile(newsPath, 'utf-8')
  const articles = JSON.parse(newsContent)

  let changed = 0

  for (const article of articles) {
    const textSource = article.searchableTitle || article.title
    const { slug, title } = classifyNews(textSource, article.summary)

    if (article.categorySlug !== slug) {
      article.categorySlug = slug
      article.categoryName = title
      article.updatedAt = new Date().toISOString()
      changed++
    }
  }

  await fs.writeFile(newsPath, `${JSON.stringify(articles, null, 2)}\n`, 'utf-8')

  console.log(`重新分类完成。共 ${articles.length} 条新闻，更新 ${changed} 条。`)
  console.log('\n分类分布：')
  const distribution = {}
  for (const article of articles) {
    distribution[article.categoryName] = (distribution[article.categoryName] || 0) + 1
  }
  for (const [name, count] of Object.entries(distribution)) {
    console.log(`  ${name}: ${count}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
