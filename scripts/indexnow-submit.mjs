const DEFAULT_KEY = 'd9b1f6a2c8e74f30b5a19d6c42e8f0ab'
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://www.papaclaw.com').replace(/\/$/, '')
const key = process.env.INDEXNOW_KEY || DEFAULT_KEY
const endpoint = process.env.INDEXNOW_ENDPOINT || 'https://www.bing.com/indexnow'
const dryRun = process.argv.includes('--dry-run')
const explicitUrls = process.argv.slice(2).filter((arg) => !arg.startsWith('--'))

function usage() {
  console.log(`
Usage:
  SITE_URL=https://www.papaclaw.com npm run indexnow:submit
  SITE_URL=https://www.papaclaw.com npm run indexnow:submit -- /news /ai-news-feed
  SITE_URL=https://www.papaclaw.com npm run indexnow:submit -- --dry-run

Environment:
  SITE_URL or NEXT_PUBLIC_SITE_URL  Website origin.
  INDEXNOW_KEY                     IndexNow key. Defaults to the key file in /public.
  INDEXNOW_ENDPOINT                Defaults to https://www.bing.com/indexnow.
`)
}

function normalizeUrls(urls) {
  const host = new URL(siteUrl).host
  return Array.from(
    new Set(
      urls
        .map((url) => url.trim())
        .filter(Boolean)
        .map((url) => new URL(url, siteUrl).toString())
        .filter((url) => new URL(url).host === host)
    )
  )
}

async function getSitemapUrls() {
  const response = await fetch(`${siteUrl}/sitemap.xml`)
  if (!response.ok) {
    throw new Error(`Failed to fetch sitemap: ${response.status}`)
  }

  const xml = await response.text()
  return Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g), (match) => match[1])
}

function chunk(urls, size) {
  const chunks = []
  for (let index = 0; index < urls.length; index += size) {
    chunks.push(urls.slice(index, index + size))
  }
  return chunks
}

async function submitChunk(urlList) {
  const payload = {
    host: new URL(siteUrl).host,
    key,
    keyLocation: `${siteUrl}/${key}.txt`,
    urlList,
  }

  if (dryRun) {
    console.log(JSON.stringify(payload, null, 2))
    return { status: 0, ok: true }
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(payload),
  })

  return { status: response.status, ok: response.ok }
}

if (process.argv.includes('--help')) {
  usage()
  process.exit(0)
}

const urls = normalizeUrls(explicitUrls.length > 0 ? explicitUrls : await getSitemapUrls())

if (urls.length === 0) {
  console.log('No URLs to submit.')
  process.exit(0)
}

if (urls.length > 10000) {
  console.log(`Submitting ${urls.length} URLs in chunks of 10,000.`)
}

for (const [index, urlList] of chunk(urls, 10000).entries()) {
  const result = await submitChunk(urlList)
  console.log(
    `Chunk ${index + 1}: ${dryRun ? 'dry-run' : result.status} ${result.ok ? 'OK' : 'FAILED'} (${urlList.length} URLs)`
  )

  if (!result.ok) {
    process.exitCode = 1
  }
}
