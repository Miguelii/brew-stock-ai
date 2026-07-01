import { Effect } from 'effect'
import { YahooPriceHistoryError } from '@/_backend/lib/errors'
import { ErrorCode } from '@/_backend/lib/error-codes'
import { fetchHistoryRaw } from '@/_backend/modules/yahoo/processors/fetch-history.processor'

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
