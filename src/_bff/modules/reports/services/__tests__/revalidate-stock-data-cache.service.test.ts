import { describe, it, expect, vi } from 'vitest'
import { Effect } from 'effect'
import { revalidateStockDataCache } from '@/_bff/modules/reports/services/revalidate-stock-data-cache.service'

const { revalidateTagMock } = vi.hoisted(() => ({ revalidateTagMock: vi.fn() }))

vi.mock('next/cache', () => ({ revalidateTag: revalidateTagMock }))

describe('revalidateStockDataCache', () => {
    it('expires the stock data cache entry of the ticker right away', async () => {
        await Effect.runPromise(revalidateStockDataCache('AAPL'))

        expect(revalidateTagMock).toHaveBeenCalledWith('stock-data-AAPL', { expire: 0 })
    })
})
