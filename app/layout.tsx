import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.papaclaw.cn'),
  title: {
    default: 'Papa Claw爬爬虾｜政企资源赋能，AI务实出海',
    template: '%s｜Papa Claw爬爬虾',
  },
  description: 'Papa Claw爬爬虾是AI数据+独家政企资源双驱动的出海结果型落地服务商，服务实体外贸生产工厂与政府及政企出海项目。',
  keywords: [
    'Papa Claw',
    '爬爬虾',
    'Papa Claw爬爬虾',
    '爬爬虾数据科技有限公司',
    'AI科技出海',
    'AI出海服务商',
    '政企资源出海',
    '中东出海服务',
    '外贸工厂出海获客',
    'AI标书代投',
    '海外社媒运营',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Papa Claw爬爬虾｜政企资源赋能，AI务实出海',
    description: 'AI数据+独家政企资源双驱动的一站式出海结果服务商。',
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
