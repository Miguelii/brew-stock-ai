import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import { SaveStockDataError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import { logger } from '@trigger.dev/sdk'
import type { GetYahooDataResult } from '@/backend/modules/yahoo/types'

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
    const response = yield* Effect.tryPromise({
        try: () =>
            supabase.from('stock_data').upsert(
                {
                    id: ticker,
                    reports: data.reports,
                    scores: data.scores,
                    sig_dev: data.sigDev,
                    financials: data.financials ?? null,
                    fundamentals: data.fundamentals ?? null,
                    last_update_at: new Date().toISOString(),
                },
                { onConflict: 'id' }
            ),
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
