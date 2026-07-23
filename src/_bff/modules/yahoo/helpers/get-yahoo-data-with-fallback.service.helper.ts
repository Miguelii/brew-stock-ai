import type { GetYahooDataResult } from '@/_bff/modules/yahoo/types'
import { hasStockData } from '@/_bff/modules/yahoo/helpers/utils.helper'
import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import { selectStockData } from '@/_bff/modules/yahoo/repositories/stock-data.repository'

type StockDataRow = Partial<Omit<GetYahooDataResult, 'sigDev'>> & {
    sig_dev?: GetYahooDataResult['sigDev']
}

export function rowToYahooData(row: StockDataRow): GetYahooDataResult {
    return {
        scores: row.scores ?? null,
        reports: row.reports ?? [],
        sigDev: row.sig_dev ?? null,
        financials: row.financials ?? null,
        fundamentals: row.fundamentals ?? null,
    }
}

export function mergeWithDbFallback(
    fresh: GetYahooDataResult,
    row: StockDataRow
): GetYahooDataResult {
    const db = rowToYahooData(row)

    return {
        scores: hasStockData(fresh.scores) ? fresh.scores : db.scores,
        reports: hasStockData(fresh.reports) ? fresh.reports : db.reports,
        sigDev: hasStockData(fresh.sigDev) ? fresh.sigDev : db.sigDev,
        financials: hasStockData(fresh.financials) ? fresh.financials : db.financials,
        fundamentals: hasStockData(fresh.fundamentals) ? fresh.fundamentals : db.fundamentals,
    }
}

export function hasAnyStockData(data: GetYahooDataResult): boolean {
    return (
        hasStockData(data.scores) ||
        hasStockData(data.reports) ||
        hasStockData(data.sigDev) ||
        hasStockData(data.financials) ||
        hasStockData(data.fundamentals)
    )
}

export function hasAllStockData(data: GetYahooDataResult): boolean {
    return (
        hasStockData(data.scores) &&
        hasStockData(data.reports) &&
        hasStockData(data.sigDev) &&
        hasStockData(data.financials) &&
        hasStockData(data.fundamentals)
    )
}

export const selectDbRow = Effect.fn('selectDbRow')(function* (
    ticker: string,
    supabaseClient?: SupabaseClient
) {
    if (!supabaseClient) return null

    return yield* selectStockData(supabaseClient, ticker).pipe(
        Effect.map((res) => (res.data ?? null) as StockDataRow | null),
        Effect.orElse(() => Effect.succeed(null))
    )
})
