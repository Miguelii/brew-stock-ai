import 'server-only'

import { Effect } from 'effect'
import { createDBAdminClient } from '@/_bff/core/db'
import { ForbiddenError, StockDataRefreshError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import { isAdmin } from '@/_bff/modules/admin/services/is-admin.service'
import { getYahooDataWithFallbackService } from '@/_bff/modules/yahoo/services/get-yahoo-data-with-fallback.service'
import { saveYahooData } from '@/_bff/modules/yahoo/processors/save-yahoo-data.processor'
import { revalidateStockDataCache } from '@/_bff/modules/reports/services/revalidate-stock-data-cache.service'

export type RefreshStockDataResult = {
    ticker: string
    reportsCount: number
}

export const refreshStockData = Effect.fn('refreshStockData')(function* (ticker: string) {
    if (!(yield* isAdmin())) {
        return yield* new ForbiddenError({ error_hash: ErrorCode.ADMIN_FORBIDDEN })
    }

    const supabase = createDBAdminClient()

    const yahoo = yield* getYahooDataWithFallbackService(ticker, supabase)

    // Nothing came from Yahoo, so saving would only rewrite the stored row with itself
    if (!yahoo?.isFresh) {
        return yield* new StockDataRefreshError({
            ticker,
            error_hash: ErrorCode.ADMIN_REFRESH_STOCK_DATA_STALE,
        })
    }

    yield* saveYahooData(yahoo.ticker, yahoo.data, supabase)
    yield* revalidateStockDataCache(yahoo.ticker)

    return {
        ticker: yahoo.ticker,
        reportsCount: yahoo.data.reports.length,
    } satisfies RefreshStockDataResult
})
