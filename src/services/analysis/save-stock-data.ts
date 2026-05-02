import 'server-only'

import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import { CreateSbClientError, SaveStockDataError } from '@/services/utils/tagged-errors'
import type { GetYahooDataResult } from './get-yahoo-data'
import { createSbAdminClient } from '@/lib/utils.server'
import { logger } from '@trigger.dev/sdk'

export const saveStockData = Effect.fn('saveStockData')(function* (
    ticker: string,
    data: GetYahooDataResult,
    supabaseClient?: SupabaseClient
) {
    const supabase =
        supabaseClient ??
        (yield* Effect.try({
            try: () => createSbAdminClient(),
            catch: (cause) => new CreateSbClientError({ cause, error_hash: 'svstckdtsbclnt' }),
        }))

    const response = yield* Effect.tryPromise({
        try: () =>
            supabase.from('stock_data').upsert(
                {
                    id: ticker,
                    reports: data.reports,
                    scores: data.scores,
                    sig_dev: data.sigDev,
                    last_update_at: new Date().toISOString(),
                },
                { onConflict: 'id' }
            ),
        catch: (cause) => new SaveStockDataError({ cause, error_hash: 'svstckdtinsrt' }),
    })

    if (response.error) {
        logger.log('SaveStockDataError', {
            cause: JSON.stringify(response.error),
            ticker: ticker,
        })
        return yield* new SaveStockDataError({ cause: response.error, error_hash: 'svstckdterr' })
    }
})
