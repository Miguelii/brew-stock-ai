import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import { CreateSbClientError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import { createSbAdminClient } from '@/lib/utils.server'
import type { GetYahooDataResult } from '@/_bff/modules/yahoo/types'
import { upsertStockData } from '@/_bff/modules/yahoo/repositories/stock-data.repository'

export const saveYahooData = Effect.fn('saveYahooData')(function* (
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
