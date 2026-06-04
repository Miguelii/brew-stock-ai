import 'server-only'

import { unstable_cache } from 'next/cache'
import { Effect } from 'effect'
import {
    CreateSbClientError,
    UnauthenticatedError,
    YahooPriceHistoryError,
} from '@/services/lib/errors'
import { ErrorCode } from '@/services/lib/error-codes'
import { GET_PRICE_HISTORY_CACHE_KEY, GET_PRICE_HISTORY_TTL } from '@/services/yahoo/constants'
import { createSbServerClient } from '@/lib/utils.server'
import { getSession } from '@/services/core/auth/get-session'
import type { PricePoint } from '@/services/yahoo/types'

const fetchHistoryRaw = async (ticker: string): Promise<PricePoint[]> => {
    const { default: YahooFinance } = await import('yahoo-finance2')
    const yf = new YahooFinance({ suppressNotices: ['yahooSurvey', 'ripHistorical'] })
    const period1 = new Date()
    period1.setFullYear(period1.getFullYear() - 1)
    const result = await yf.chart(ticker, { period1, interval: '1d' })
    return result.quotes
        .filter((r) => r.close != null)
        .map((r) => ({ date: r.date.getTime(), close: r.close! }))
}

const fetchHistoryCached = (ticker: string) =>
    unstable_cache(() => fetchHistoryRaw(ticker), [GET_PRICE_HISTORY_CACHE_KEY, ticker], {
        revalidate: GET_PRICE_HISTORY_TTL,
    })

/**
 * Raw fetcher — no session guard, no `unstable_cache`. Used inside the analysis
 * pipeline (Trigger.dev runtime), where there is no user session and the Next.js
 * data cache is not available.
 */
export const getPriceHistory = Effect.fn('getPriceHistory')(function* (ticker: string) {
    return yield* Effect.tryPromise({
        try: () => fetchHistoryRaw(ticker),
        catch: (cause) =>
            new YahooPriceHistoryError({
                ticker: `|${ticker}|`,
                cause,
                error_hash: ErrorCode.YAHOO_PRICE_HISTORY,
            }),
    })
})

/**
 * Cached, session-gated wrapper exposed to the user via tRPC. The session check
 * avoids spamming the upstream endpoint and `unstable_cache` serves the user.
 */
export const getCachedPriceHistory = Effect.fn('getCachedPriceHistory')(function* (ticker: string) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({
                cause,
                error_hash: ErrorCode.REPORT_CREATE_SB_CLIENT,
            }),
    })

    const user = yield* getSession(supabase)

    if (!user) {
        return yield* new UnauthenticatedError({ error_hash: ErrorCode.REPORT_CREATE_UNAUTH })
    }

    return yield* Effect.tryPromise({
        try: () => fetchHistoryCached(ticker)(),
        catch: (cause) =>
            new YahooPriceHistoryError({
                ticker: `|${ticker}|`,
                cause,
                error_hash: ErrorCode.YAHOO_PRICE_HISTORY,
            }),
    })
})
