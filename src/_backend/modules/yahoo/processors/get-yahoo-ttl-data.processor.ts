import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getYahooData } from '@/_backend/modules/yahoo/processors/get-yahoo-data.processor'
import { getYahooTicker } from '@/_backend/modules/yahoo/processors/get-yahoo-ticker.processor'
import type { GetYahooDataResult, YahooTtlResult } from '@/_backend/modules/yahoo/types'
import { YAHOO_DATA_TTL } from '@/_backend/modules/yahoo/constants'
import { selectStockDataWithTtl } from '@/_backend/modules/yahoo/repositories/stock-data.repository'

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

            return selectStockDataWithTtl(supabaseClient, yahoo_ticker).pipe(
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
