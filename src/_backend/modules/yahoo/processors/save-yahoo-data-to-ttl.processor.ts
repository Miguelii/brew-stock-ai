import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import { CreateSbClientError } from '@/_backend/lib/errors'
import { ErrorCode } from '@/_backend/lib/error-codes'
import { createSbAdminClient } from '@/lib/utils.server'
import type { GetYahooDataResult } from '@/_backend/modules/yahoo/types'
import { upsertStockData } from '@/_backend/modules/yahoo/repositories/stock-data.repository'

export const saveYahooDataToTTL = Effect.fn('saveYahooDataToTTL')(function* (
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

    yield* upsertStockData(supabase, ticker, data)
})
