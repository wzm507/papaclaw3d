import fs from 'fs/promises'
import path from 'path'

export type SiteConfig = Record<string, unknown>

const SITE_CONFIG_KEY = 'papaclaw:site:config'
const localConfigPath = path.join(process.cwd(), 'data', 'site-config.json')

function hasKvConfig(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

async function kvCommand<T>(command: unknown[]): Promise<T | null> {
  if (!hasKvConfig()) return null

  const response = await fetch(process.env.KV_REST_API_URL!, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`KV request failed: ${response.status}`)
  }

  const payload = (await response.json()) as { result?: T }
  return payload.result ?? null
}

async function readLocalSiteConfig(): Promise<SiteConfig> {
  const content = await fs.readFile(localConfigPath, 'utf-8')
  return JSON.parse(content) as SiteConfig
}

async function writeLocalSiteConfig(config: SiteConfig): Promise<void> {
  await fs.mkdir(path.dirname(localConfigPath), { recursive: true })
  await fs.writeFile(localConfigPath, `${JSON.stringify(config, null, 2)}\n`, 'utf-8')
}

export async function getSiteConfig(): Promise<SiteConfig> {
  if (hasKvConfig()) {
    const stored = await kvCommand<string>(['GET', SITE_CONFIG_KEY])
    if (stored) return JSON.parse(stored) as SiteConfig
  }

  return readLocalSiteConfig()
}

export async function saveSiteConfig(config: SiteConfig): Promise<void> {
  if (process.env.VERCEL && !hasKvConfig()) {
    throw new Error('Vercel deployment requires KV_REST_API_URL and KV_REST_API_TOKEN for site config persistence.')
  }

  if (hasKvConfig()) {
    await kvCommand<string>(['SET', SITE_CONFIG_KEY, JSON.stringify(config)])
    return
  }

  await writeLocalSiteConfig(config)
}
