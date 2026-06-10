import 'server-only'

import { Effect } from 'effect'
import { ServerEnv } from '@/env/server'
import { LatestNewsError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import { fetchLatestNewsRaw } from '@/backend/modules/finnhub/helpers/fetch-latest-news.helper'

/**
 * Raw fetcher — no session guard, no `unstable_cache`. Used inside the analysis
 * pipeline (Trigger.dev runtime), where there is no user session and the Next.js
 * data cache is not available.
 */
export const getLatestNewsService = Effect.fn('getLatestNews')(function* (ticker: string) {
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
