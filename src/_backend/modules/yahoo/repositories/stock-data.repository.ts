import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import { SaveStockDataError } from '@/_backend/lib/errors'
import { ErrorCode } from '@/_backend/lib/error-codes'
import { logger } from '@trigger.dev/sdk'
import type { GetYahooDataResult } from '@/_backend/modules/yahoo/types'
import { hasStockData } from '../helpers/has-stock-data.helper'

// Returns the raw Supabase response — the TTL processor decides staleness and fallbacks
export function selectStockDataWithTtl(supabase: SupabaseClient, ticker: string) {
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
    const payload: Record<string, unknown> = {
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
        logger.log('SaveYahooDataError', {
            cause: JSON.stringify(response.error),
            ticker: ticker,
        })
        return yield* new SaveStockDataError({
            cause: response.error,
            error_hash: ErrorCode.SAVE_STOCK_DATA_ERR,
        })
    }
})
