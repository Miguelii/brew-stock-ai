import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { GetYahooDataResult } from '@/_bff/modules/yahoo/types'
import { upsertStockData } from '@/_bff/modules/yahoo/repositories/stock-data.repository'

export const saveYahooData = Effect.fn('saveYahooData')(function* (
    ticker: string | null,
    data: GetYahooDataResult,
    supabase: SupabaseClient
) {
    yield* upsertStockData(supabase, ticker, data)
})
