import 'server-only'

import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getYahooData } from '@/services/yahoo/get-yahoo-data'
import { getYahooTicker } from '@/services/yahoo/get-yahoo-ticker'
import type { GetYahooDataResult, YahooTtlResult } from '@/services/yahoo/types'
import { YAHOO_DATA_TTL } from '@/services/yahoo/constants'

export const getYahooTtlData = Effect.fn('getYahooTtlData')(function* (
    stockSymbol: string,
    supabaseClient?: SupabaseClient
) {
    const result: YahooTtlResult = yield* getYahooTicker(stockSymbol).pipe(
        Effect.flatMap((yahoo_ticker) => {
            if (!supabaseClient)
                return getYahooData(yahoo_ticker).pipe(
                    Effect.map((data) => ({
                        ticker: yahoo_ticker,
                        data: data as GetYahooDataResult,
                        isFresh: true,
                    }))
                )

            return Effect.tryPromise({
                try: () =>
                    supabaseClient
                        .from('stock_data')
                        .select('*, last_update_at')
                        .eq('id', yahoo_ticker)
                        .maybeSingle(),
                catch: (cause) => cause,
            }).pipe(
                Effect.flatMap((res) => {
                    const row = res.data
                    const isStale =
                        !row?.last_update_at ||
                        Date.now() - new Date(row.last_update_at).getTime() >= YAHOO_DATA_TTL

                    if (isStale) {
                        return getYahooData(yahoo_ticker).pipe(
                            Effect.map((data) => ({
                                ticker: yahoo_ticker,
                                data: data as GetYahooDataResult,
                                isFresh: true,
                            }))
                        )
                    }

                    return Effect.succeed({
                        ticker: yahoo_ticker,
                        data: row as unknown as GetYahooDataResult,
                        isFresh: false,
                    })
                }),
                Effect.orElse(() =>
                    getYahooData(yahoo_ticker).pipe(
                        Effect.map((data) => ({
                            ticker: yahoo_ticker,
                            data: data as GetYahooDataResult,
                            isFresh: true,
                        }))
                    )
                )
            )
        }),
        Effect.orElse(() => Effect.succeed(null))
    )

    return result
})
