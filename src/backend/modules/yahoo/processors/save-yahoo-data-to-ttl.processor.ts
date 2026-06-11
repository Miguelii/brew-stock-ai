import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import { CreateSbClientError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import { createSbAdminClient } from '@/lib/utils.server'
import type { GetYahooDataResult } from '@/backend/modules/yahoo/types'
import { upsertStockData } from '@/backend/modules/yahoo/repositories/stock-data.repository'

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
