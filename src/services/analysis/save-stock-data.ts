import 'server-only'

import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import { CreateSbClientError, SaveStockDataError } from '@/services/errors'
import { ErrorCode } from '@/services/error-codes'
import { createSbAdminClient } from '@/lib/utils.server'
import { logger } from '@trigger.dev/sdk'
import type { GetYahooDataResult } from '@/services/analysis/types'

export const saveStockData = Effect.fn('saveStockData')(function* (
    ticker: string | null,
    data: GetYahooDataResult,
    supabaseClient?: SupabaseClient
) {
    const supabase =
        supabaseClient ??
        (yield* Effect.try({
            try: () => createSbAdminClient(),
            catch: (cause) =>
                new CreateSbClientError({ cause, error_hash: ErrorCode.SAVE_STOCK_DATA_SB_CLIENT }),
        }))

    const response = yield* Effect.tryPromise({
        try: () =>
            supabase.from('stock_data').upsert(
                {
                    id: ticker,
                    reports: data.reports,
                    scores: data.scores,
                    sig_dev: data.sigDev,
                    financials: data.financials ?? null,
                    last_update_at: new Date().toISOString(),
                },
                { onConflict: 'id' }
            ),
        catch: (cause) =>
            new SaveStockDataError({ cause, error_hash: ErrorCode.SAVE_STOCK_DATA_INSERT }),
    })

    if (response.error) {
        logger.log('SaveStockDataError', {
            cause: JSON.stringify(response.error),
            ticker: ticker,
        })
        return yield* new SaveStockDataError({
            cause: response.error,
            error_hash: ErrorCode.SAVE_STOCK_DATA_ERR,
        })
    }
})
