import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getYahooData } from '@/_bff/modules/yahoo/processors/get-yahoo-data.processor'
import type { GetYahooDataResult, YahooDataWithFallbackResult } from '@/_bff/modules/yahoo/types'
import {
    hasAllStockData,
    hasAnyStockData,
    mergeWithDbFallback,
    rowToYahooData,
    selectDbRow,
} from '@/_bff/modules/yahoo/helpers/get-yahoo-data-with-fallback.service.helper'

/**
 * Fetch Yahoo data for an already resolved ticker, falling back to the stored
 * row when Yahoo fails fully or partially. Ticker resolution is the caller's
 * job, so it can run other ticker-dependent fetches in parallel with this one.
 */
export const getYahooDataWithFallbackService: (
    ticker: string,
    supabaseClient?: SupabaseClient
) => Effect.Effect<YahooDataWithFallbackResult> = Effect.fn('getYahooDataWithFallbackService')(
    function* (ticker, supabaseClient) {
        // Always try to get Yahoo fresh data
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
