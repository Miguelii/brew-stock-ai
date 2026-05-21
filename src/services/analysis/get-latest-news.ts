import 'server-only'

import { unstable_cache } from 'next/cache'
import { Effect } from 'effect'
import { LatestNewsError } from '@/services/errors'
import { ErrorCode } from '@/services/error-codes'
import { ServerEnv } from '@/env/server'
import type { NewsItem } from '@/types/news'
import { LATEST_NEWS_CACHE_KEY, LATEST_NEWS_TTL } from '@/services/analysis/helpers/constants'

const fetchLatestNewsFn = (ticker: string) =>
    unstable_cache(
        async () => {
            const to = new Date()
            const from = new Date()
            from.setFullYear(from.getFullYear() - 1)

            const fmt = (d: Date) => d.toISOString().split('T')[0]
            const url = `https://finnhub.io/api/v1/company-news?symbol=${encodeURIComponent(ticker)}&from=${fmt(from)}&to=${fmt(to)}&token=${ServerEnv.NEXT_FINNHUB_API_KEY}`

            const raw = await fetch(url).then((res) => res.json())

            if (!Array.isArray(raw)) throw new Error(`Unexpected news response for ${ticker}`)

            return (raw as NewsItem[]).slice(0, 3)
        },
        [LATEST_NEWS_CACHE_KEY, ticker],
        {
            revalidate: LATEST_NEWS_TTL,
            tags: [LATEST_NEWS_CACHE_KEY],
        }
    )

export const getLatestNews = Effect.fn('getLatestNews')(function* (ticker: string) {
    return yield* Effect.tryPromise({
        try: () => fetchLatestNewsFn(ticker)(),
        catch: (cause) => new LatestNewsError({ cause, error_hash: ErrorCode.LATEST_NEWS_FETCH }),
    })
})
