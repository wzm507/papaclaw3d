import { NextResponse } from 'next/server'
import { getSiteConfig, saveSiteConfig } from '../../lib/site-config-store'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    return NextResponse.json(await getSiteConfig())
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read config', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await saveSiteConfig(body)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to write config', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
