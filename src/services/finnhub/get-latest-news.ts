import 'server-only'

import { unstable_cache } from 'next/cache'
import { Effect } from 'effect'
import { CreateSbClientError, LatestNewsError, UnauthenticatedError } from '@/services/lib/errors'
import { ErrorCode } from '@/services/lib/error-codes'
import { ServerEnv } from '@/env/server'
import type { NewsItem } from '@/types/news'
import { LATEST_NEWS_CACHE_KEY, LATEST_NEWS_TTL } from '@/services/finnhub/constants'
import { createSbServerClient } from '@/lib/utils.server'
import { getSession } from '@/services/core/auth/get-session'

const fetchLatestNewsRaw = async (ticker: string): Promise<NewsItem[]> => {
    const to = new Date()
    const from = new Date()
    from.setFullYear(from.getFullYear() - 1)

    const fmt = (d: Date) => d.toISOString().split('T')[0]
    const url = `${ServerEnv.NEXT_FINNHUB_BASE_URL}/company-news?symbol=${encodeURIComponent(ticker)}&from=${fmt(from)}&to=${fmt(to)}&token=${ServerEnv.NEXT_FINNHUB_API_KEY}`

    const raw = await fetch(url).then((res) => res.json())

    if (!Array.isArray(raw)) throw new Error(`Unexpected news response for ${ticker}`)

    return (raw as NewsItem[]).slice(0, 3)
}

const fetchLatestNewsCached = (ticker: string) =>
    unstable_cache(() => fetchLatestNewsRaw(ticker), [LATEST_NEWS_CACHE_KEY, ticker], {
        revalidate: LATEST_NEWS_TTL,
        tags: [LATEST_NEWS_CACHE_KEY],
    })

/**
 * Raw fetcher — no session guard, no `unstable_cache`. Used inside the analysis
 * pipeline (Trigger.dev runtime), where there is no user session and the Next.js
 * data cache is not available.
 */
export const getLatestNews = Effect.fn('getLatestNews')(function* (ticker: string) {
    if (!ServerEnv.NEXT_FINNHUB_API_KEY || ServerEnv.NEXT_FINNHUB_API_KEY === '') {
        return yield* new LatestNewsError({
            ticker: `|${ticker}|`,
            cause: 'NO API KEY',
            error_hash: ErrorCode.LATEST_NEWS_API_KEY_MISSING,
        })
    }

    return yield* Effect.tryPromise({
        try: () => fetchLatestNewsRaw(ticker),
        catch: (cause) =>
            new LatestNewsError({
                ticker: `|${ticker}|`,
                cause,
                error_hash: ErrorCode.LATEST_NEWS_FETCH,
            }),
    })
})

/**
 * Cached, session-gated wrapper exposed to the user via tRPC. The session check
 * avoids spamming the upstream endpoint and `unstable_cache` serves the user.
 */
export const getCachedLatestNews = Effect.fn('getCachedLatestNews')(function* (ticker: string) {
    if (!ServerEnv.NEXT_FINNHUB_API_KEY || ServerEnv.NEXT_FINNHUB_API_KEY === '') {
        return yield* new LatestNewsError({
            ticker: `|${ticker}|`,
            cause: 'NO API KEY',
            error_hash: ErrorCode.LATEST_NEWS_API_KEY_MISSING,
        })
    }

    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.REPORT_CREATE_SB_CLIENT }),
    })

    const user = yield* getSession(supabase)

    if (!user) {
        return yield* new UnauthenticatedError({ error_hash: ErrorCode.REPORT_CREATE_UNAUTH })
    }

    return yield* Effect.tryPromise({
        try: () => fetchLatestNewsCached(ticker)(),
        catch: (cause) =>
            new LatestNewsError({
                ticker: `|${ticker}|`,
                cause,
                error_hash: ErrorCode.LATEST_NEWS_FETCH,
            }),
    })
})
