import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: '未找到文件' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: '不支持的文件类型，仅支持 JPG/PNG/GIF/WebP/SVG' }, { status: 400 })
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: '文件大小不能超过 10MB' }, { status: 400 })
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const ext = path.extname(file.name) || `.${file.type.split('/')[1]}`
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`
    const filePath = path.join(uploadsDir, uniqueName)

    // Write file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    fs.writeFileSync(filePath, buffer)

    // Return the public URL path
    const url = `/uploads/${uniqueName}`

    return NextResponse.json({ url, name: file.name })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: '上传失败' }, { status: 500 })
  }
}
