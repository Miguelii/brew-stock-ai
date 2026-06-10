import 'server-only'

import { Effect, Match } from 'effect'
import { YahooPriceHistoryError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import { fetchHistoryCached } from '../helpers/fetch-history-raw.helper'
import { MAX_STOCK_INPUT_LENGHT } from '@/lib/constants'
import { protectedProcedure } from '@/server/trpc'
import { runEffect } from '@/server/utils'
import { z } from 'zod'

/**
 * Cached, session-gated wrapper exposed to the user via tRPC. The session check
 * avoids spamming the upstream endpoint and `unstable_cache` serves the user.
 *
 * @protected procedure
 */
const getPriceHistory = Effect.fn('getPriceHistory')(function* (ticker: string) {
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

export const GET_PRICE_HISTORY_PROTECTED_PROCEDURE = protectedProcedure
    .input(z.object({ ticker: z.string().min(1).max(MAX_STOCK_INPUT_LENGHT) }))
    .query(({ input }) =>
        runEffect(getPriceHistory(input.ticker), 'getCachedPriceHistory', (error) =>
            Match.value(error).pipe(
                Match.tag('YahooPriceHistoryError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.exhaustive
            )
        )
    )
