import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.papaclaw.cn'),
  title: {
    default: 'Papa Claw爬爬虾｜AI出海获客引擎 — 用AI帮出海企业拿订单',
    template: '%s｜Papa Claw爬爬虾',
  },
  description:
    '爬爬虾(Papa Claw)是做出海的AI获客引擎。用AI批量生产本土化内容、运营多平台账号矩阵、做AI搜索占位(GEO)，帮出海企业获取海外客户。创始人9个月帮客户成交3亿，跑通香港和韩国跨境直播带货，自研DABIE直播ERP系统。',
  keywords: [
    'Papa Claw',
    '爬爬虾',
    'Papa Claw爬爬虾',
    'AI科技出海',
    'AI科技出海服务商',
    '政企资源出海',
    '中东出海服务',
    '外贸工厂出海',
    '外贸工厂出海获客',
    'AI标书代投',
    '海外社媒代运营',
    '海外社媒运营',
    '跨境金融服务',
    '南沙企业出海',
    '中东政企资源',
  ],
  alternates: {
    canonical: '/',
    languages: {
      'zh-CN': '/',
    },
  },
  openGraph: {
    title: 'AI出海获客引擎 — 用AI帮出海企业拿订单',
    description:
      '爬爬虾是做出海的AI获客引擎。自己干过3亿成交，跑通香港和韩国跨境直播带货，自研DABIE直播ERP系统。',
    url: 'https://www.papaclaw.cn',
    siteName: 'Papa Claw 爬爬虾',
    locale: 'zh_CN',
    type: 'website',
    images: [
      {
        url: 'https://www.papaclaw.cn/assets/papa-claw-logo.png',
        alt: 'Papa Claw 爬爬虾',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI出海获客引擎 — Papa Claw 爬爬虾',
    description:
      '做出海的AI获客引擎。自己干过3亿成交，跑通香港和韩国跨境直播带货。',
    images: ['https://www.papaclaw.cn/assets/papa-claw-logo.png'],
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
