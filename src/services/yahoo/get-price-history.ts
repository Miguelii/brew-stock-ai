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

type PricePoint = { date: number; close: number }

const fetchHistory = (ticker: string) =>
    unstable_cache(
        async (): Promise<PricePoint[]> => {
            const { default: YahooFinance } = await import('yahoo-finance2')
            const yf = new YahooFinance({ suppressNotices: ['yahooSurvey', 'ripHistorical'] })
            const period1 = new Date()
            period1.setFullYear(period1.getFullYear() - 1)
            const result = await yf.chart(ticker, { period1, interval: '1d' })
            return result.quotes
                .filter((r) => r.close != null)
                .map((r) => ({ date: r.date.getTime(), close: r.close! }))
        },
        [GET_PRICE_HISTORY_CACHE_KEY, ticker],
        { revalidate: GET_PRICE_HISTORY_TTL }
    )

export const getPriceHistory = Effect.fn('getPriceHistory')(function* (ticker: string) {
    // To avoid spaming this endpoint, we verify if the session is active
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
        try: () => fetchHistory(ticker)(),
        catch: (cause) =>
            new YahooPriceHistoryError({
                ticker: `|${ticker}|`,
                cause: cause,
                error_hash: ErrorCode.YAHOO_PRICE_HISTORY,
            }),
    })
})
