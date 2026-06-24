import { NextResponse } from 'next/server'
import { generateLlmsFullText } from '../lib/llms-content'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  return new NextResponse(await generateLlmsFullText(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  })
}
