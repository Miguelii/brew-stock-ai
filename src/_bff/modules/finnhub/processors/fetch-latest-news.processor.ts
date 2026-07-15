import { ServerEnv } from '@/env/server'
import type { NewsItem } from '@/types/news'
import { unstable_cache } from 'next/cache'
import { toIso } from '@/lib/formatters'
import { LATEST_NEWS_CACHE_KEY, LATEST_NEWS_TTL } from '@/_bff/modules/finnhub/constants'

const FETCH_TIMEOUT_MS = 30_000

export const fetchLatestNewsRaw = async (ticker: string): Promise<NewsItem[]> => {
    const to = new Date()
    const from = new Date()
    from.setFullYear(from.getFullYear() - 1)

    const url = `${ServerEnv.NEXT_FINNHUB_BASE_URL}/company-news?symbol=${encodeURIComponent(ticker)}&from=${toIso(from)}&to=${toIso(to)}&token=${ServerEnv.NEXT_FINNHUB_API_KEY}`

    const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })

    if (!res.ok) throw new Error(`Finnhub news request failed for ${ticker}: ${res.status}`)

    const raw = await res.json()

    if (!Array.isArray(raw)) throw new Error(`Unexpected news response for ${ticker}`)

    return (raw as NewsItem[]).slice(0, 3)
}

export const fetchLatestNewsCached = (ticker: string) =>
    unstable_cache(() => fetchLatestNewsRaw(ticker), [LATEST_NEWS_CACHE_KEY, ticker], {
        revalidate: LATEST_NEWS_TTL,
        tags: [LATEST_NEWS_CACHE_KEY],
    })
