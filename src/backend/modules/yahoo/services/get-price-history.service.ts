import 'server-only'

import { Effect } from 'effect'
import { YahooPriceHistoryError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import { fetchHistoryCached } from '@/backend/modules/yahoo/processors/fetch-history.processor'

/**
 * Cached, session-gated wrapper exposed to the user via tRPC. The session check
 * avoids spamming the upstream endpoint and `unstable_cache` serves the user.
 */
export const getPriceHistory = Effect.fn('getPriceHistory')(function* (ticker: string) {
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
