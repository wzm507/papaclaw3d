import type { Metadata } from 'next'
import './globals-preview.css'

export const metadata: Metadata = {
  title: 'Papa Claw 爬爬虾 · 新版预览',
  description: '瑞士编辑极简风格预览页面',
  robots: {
    index: false,
    follow: false,
  },
}

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="preview-root">
      {children}
    </div>
  )
}
