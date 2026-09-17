import { Effect } from 'effect'
import { revalidateTag } from 'next/cache'
import { stockDataCacheTag } from '@/_bff/modules/reports/constants'

export const revalidateStockDataCache = Effect.fn('revalidateStockDataCache')(function* (
    ticker: string
) {
    yield* Effect.sync(() => revalidateTag(stockDataCacheTag(ticker), { expire: 0 }))
})
