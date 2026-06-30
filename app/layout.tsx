import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.papaclaw.cn'),
  title: {
    default: 'Papa Claw爬爬虾｜AI科技出海与政企资源落地服务商',
    template: '%s｜Papa Claw爬爬虾',
  },
  description:
    'Papa Claw爬爬虾是AI数据+独家政企资源双驱动的出海结果型落地服务商，服务实体外贸生产工厂与政府及政企出海项目。提供AI科技出海、外贸工厂海外获客、标书代投、跨境金融服务、海外社媒运营。',
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
    title: 'Papa Claw爬爬虾｜AI科技出海与政企资源落地服务商',
    description:
      'Papa Claw爬爬虾是AI数据+独家政企资源双驱动的出海结果型落地服务商，服务实体外贸生产工厂与政府及政企出海项目。',
    url: '/',
    siteName: 'Papa Claw爬爬虾',
    locale: 'zh_CN',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Papa Claw爬爬虾｜AI科技出海与政企资源落地服务商',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Papa Claw爬爬虾｜AI科技出海与政企资源落地服务商',
    description:
      'Papa Claw爬爬虾是AI数据+独家政企资源双驱动的出海结果型落地服务商，服务实体外贸生产工厂与政府及政企出海项目。',
    images: ['/images/og-image.jpg'],
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
