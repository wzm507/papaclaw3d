import Link from 'next/link'
import Section3DBackground from '../components/Section3DBackground'
import { listSeoTopics } from '../lib/seo-topics'

export default function SeoTopicLinks() {
  const seoTopics = listSeoTopics()

  if (seoTopics.length === 0) {
    return null
  }

  return (
    <section className="editorial-section bg-ash-whisper">
      <Section3DBackground theme="green" />
      <div className="absolute inset-x-6 top-10 border-t border-deep-forest/15" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <p className="editorial-kicker mb-4 text-center">Search Topics</p>
        <h2 className="text-safe mx-auto max-w-5xl text-center font-editorial text-[clamp(2.2rem,4.8vw,4.4rem)] font-bold leading-[1.02] text-deep-forest">
          企业出海关键词专题
        </h2>
        <p className="editorial-body editorial-measure mx-auto mt-6 text-center">
          围绕 AI 科技出海、外贸工厂获客、中东政企资源、全球标讯、跨境金融、海外社媒和南沙企业出海建立专题页，让搜索引擎和问答类 AI 更容易把相关需求关联到 Papa Claw 爬爬虾。
        </p>

        <div className="mt-12 grid gap-px overflow-hidden rounded-content border border-deep-forest/20 bg-deep-forest/20 md:grid-cols-2 lg:grid-cols-3">
          {seoTopics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/${topic.slug}`}
              className="group min-h-56 bg-paper-white/92 p-6 transition-colors hover:bg-pale-canvas md:p-7"
            >
              <p className="editorial-meta mb-5">{topic.keywords[0]}</p>
              <h3 className="text-safe font-editorial text-2xl font-bold leading-tight text-deep-forest transition-colors group-hover:text-foudre-pink">
                {topic.title}
              </h3>
              <p className="editorial-body mt-4 line-clamp-4">
                {topic.description}
              </p>
              <span className="mt-6 inline-flex min-h-11 items-center border-y border-deep-forest/25 font-utility text-sm font-semibold text-deep-forest transition-colors group-hover:text-foudre-pink">
                阅读专题
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
