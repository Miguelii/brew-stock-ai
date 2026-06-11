import 'server-only'

import { Effect, Match } from 'effect'
import { ServerEnv } from '@/env/server'
import { LatestNewsError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import { fetchLatestNewsCached } from '@/backend/modules/finnhub/processors/fetch-latest-news.processor'
import { MAX_STOCK_INPUT_LENGHT } from '@/lib/constants'
import { protectedProcedure } from '@/_trpc/server'
import { runEffect } from '@/_trpc/utils'
import { z } from 'zod'

/**
 * Cached, session-gated wrapper exposed to the user via tRPC. The session check
 * avoids spamming the upstream endpoint and `unstable_cache` serves the user.
 *
 * @protected procedure
 */
const getLatestNews = Effect.fn('getLatestNews')(function* (ticker: string) {
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

export const GET_LATEST_NEWS_PROTECTED_PROCEDURE = protectedProcedure
    .input(z.object({ ticker: z.string().min(1).max(MAX_STOCK_INPUT_LENGHT) }))
    .query(({ input }) =>
        runEffect(getLatestNews(input.ticker), 'getLatestNewsProcedure', (error) =>
            Match.value(error).pipe(
                Match.tag('LatestNewsError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.exhaustive
            )
        )
    )
