import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getYahooData } from '@/_bff/modules/yahoo/processors/get-yahoo-data.processor'
import { getYahooTicker } from '@/_bff/modules/yahoo/processors/get-yahoo-ticker.processor'
import type { GetYahooDataResult, YahooDataWithFallbackResult } from '@/_bff/modules/yahoo/types'
import {
    hasAllStockData,
    hasAnyStockData,
    mergeWithDbFallback,
    rowToYahooData,
    selectDbRow,
} from '@/_bff/modules/yahoo/helpers/get-yahoo-data-with-fallback.service.helper'

export const getYahooDataWithFallbackService: (
    stockSymbol: string,
    supabaseClient?: SupabaseClient
) => Effect.Effect<YahooDataWithFallbackResult> = Effect.fn('getYahooDataWithFallbackService')(
    function* (stockSymbol, supabaseClient) {
        const ticker = yield* getYahooTicker(stockSymbol).pipe(
            Effect.orElse(() => Effect.succeed(null))
        )
        if (!ticker) return null

        // Always try to get Yahoo frest data
        const freshData = (yield* getYahooData(ticker).pipe(
            Effect.orElse(() => Effect.succeed(null))
        )) as GetYahooDataResult | null

        // If success and hasAllStockData -> return
        if (freshData && hasAllStockData(freshData)) {
            return { ticker, data: freshData, isFresh: true }
        }

        const row = yield* selectDbRow(ticker, supabaseClient)

        // Total Yahoo failure -> fallback to stored data
        if (!freshData) {
            return row ? { ticker, data: rowToYahooData(row), isFresh: false } : null
        }

        // Partial Yahoo failure -> fill the missing fields with the stored data
        return {
            ticker,
            data: row ? mergeWithDbFallback(freshData, row) : freshData,
            isFresh: hasAnyStockData(freshData),
        }
    }
)
