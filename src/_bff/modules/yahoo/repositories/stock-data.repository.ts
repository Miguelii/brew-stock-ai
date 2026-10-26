import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import { SaveStockDataError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import type { GetYahooDataResult } from '@/_bff/modules/yahoo/types'
import { hasStockData } from '@/_bff/modules/yahoo/helpers/utils.helper'

// Columns written to `stock_data`: empty sections are omitted so they never overwrite stored data
type StockDataUpsert = {
    id: string | null
    last_update_at: string
    reports?: GetYahooDataResult['reports']
    scores?: GetYahooDataResult['scores']
    sig_dev?: GetYahooDataResult['sigDev']
    financials?: GetYahooDataResult['financials']
    fundamentals?: GetYahooDataResult['fundamentals']
}

// Returns the raw Supabase response, the fallback processor decides how to use it
export function selectStockData(supabase: SupabaseClient, ticker: string) {
    return Effect.tryPromise({
        try: () =>
            supabase.from('stock_data').select('*, last_update_at').eq('id', ticker).maybeSingle(),
        catch: (cause) => cause,
    })
}

export const upsertStockData = Effect.fn('upsertStockData')(function* (
    supabase: SupabaseClient,
    ticker: string | null,
    data: GetYahooDataResult
) {
    const payload: StockDataUpsert = {
        id: ticker,
        last_update_at: new Date().toISOString(),
    }

    if (hasStockData(data?.reports)) payload.reports = data.reports
    if (hasStockData(data?.scores)) payload.scores = data.scores
    if (hasStockData(data?.sigDev)) payload.sig_dev = data.sigDev
    if (hasStockData(data?.financials)) payload.financials = data.financials
    if (hasStockData(data?.fundamentals)) payload.fundamentals = data.fundamentals

    const response = yield* Effect.tryPromise({
        try: () => supabase.from('stock_data').upsert(payload, { onConflict: 'id' }),
        catch: (cause) =>
            new SaveStockDataError({ cause, error_hash: ErrorCode.SAVE_STOCK_DATA_INSERT }),
    })

    if (response.error) {
        return yield* new SaveStockDataError({
            cause: response.error,
            error_hash: ErrorCode.SAVE_STOCK_DATA_ERR,
        })
    }
})
