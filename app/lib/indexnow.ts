export const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'd9b1f6a2c8e74f30b5a19d6c42e8f0ab'

export interface IndexNowSubmitResult {
  ok: boolean
  status: number
  submitted: number
  endpoint: string
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.papaclaw.cn').replace(/\/$/, '')
}

function indexNowEndpoint() {
  return process.env.INDEXNOW_ENDPOINT || 'https://www.bing.com/indexnow'
}

function normalizeUrls(urls: string[]): string[] {
  const host = new URL(siteUrl()).host

  return Array.from(
    new Set(
      urls
        .map((url) => url.trim())
        .filter(Boolean)
        .map((url) => new URL(url, siteUrl()).toString())
        .filter((url) => new URL(url).host === host)
    )
  )
}

export function getIndexNowKeyLocation() {
  return `${siteUrl()}/${INDEXNOW_KEY}.txt`
}

export async function submitIndexNowUrls(urls: string[]): Promise<IndexNowSubmitResult> {
  const urlList = normalizeUrls(urls).slice(0, 10000)
  const endpoint = indexNowEndpoint()

  if (urlList.length === 0) {
    return {
      ok: true,
      status: 204,
      submitted: 0,
      endpoint,
    }
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      host: new URL(siteUrl()).host,
      key: INDEXNOW_KEY,
      keyLocation: getIndexNowKeyLocation(),
      urlList,
    }),
    cache: 'no-store',
  })

  return {
    ok: response.ok,
    status: response.status,
    submitted: urlList.length,
    endpoint,
  }
}
