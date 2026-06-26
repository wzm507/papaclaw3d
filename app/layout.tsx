import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.papaclaw.cn'),
  title: {
    default: 'Papa Claw爬爬虾｜不铺摊子，只铺结果',
    template: '%s｜Papa Claw爬爬虾',
  },
  description: 'Papa Claw 爬爬虾，先付出、先交朋友、用成本价帮你出海。你不赚钱，我们只收工时费。14 年中东政企资源 + 全链路 AI 数据能力，服务实体外贸工厂与政府及政企出海项目。',
  keywords: [
    'Papa Claw',
    '爬爬虾',
    'Papa Claw爬爬虾',
    'AI科技出海',
    '政企资源出海',
    '中东出海服务',
    '外贸工厂出海获客',
    'AI标书代投',
    '海外社媒运营',
    '跨境金融服务',
    '南沙企业出海',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Papa Claw爬爬虾｜不铺摊子，只铺结果',
    description: '先付出、先交朋友、用成本价帮你出海。你不赚钱，我们只收工时费。',
    url: '/',
    siteName: 'Papa Claw爬爬虾',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
