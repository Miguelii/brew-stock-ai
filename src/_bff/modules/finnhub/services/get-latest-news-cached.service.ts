import 'server-only'

import { Effect } from 'effect'
import { ServerEnv } from '@/env/server'
import { LatestNewsError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import { fetchLatestNewsCached } from '@/_bff/modules/finnhub/processors/fetch-latest-news.processor'

/**
 * Cached, session-gated fetcher exposed to the user via tRPC. The session check
 * avoids spamming the upstream endpoint and `unstable_cache` serves the user.
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
        try: () => fetchLatestNewsCached(ticker)(),
        catch: (cause) =>
            new LatestNewsError({
                ticker: `|${ticker}|`,
                cause,
                error_hash: ErrorCode.LATEST_NEWS_FETCH,
            }),
    })
})
