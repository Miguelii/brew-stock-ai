import 'server-only'

import { Effect } from 'effect'
import { YahooPriceHistoryError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import { fetchHistoryCached } from '@/_bff/modules/yahoo/processors/fetch-history.processor'

/**
 * Cached, session-gated wrapper exposed to the user via tRPC. The session check
 * avoids spamming the upstream endpoint and `unstable_cache` serves the user.
 */
export const getCachedPriceHistoryService = Effect.fn('getCachedPriceHistoryService')(function* (
    ticker: string
) {
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
