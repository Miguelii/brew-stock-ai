import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { getCachedPriceHistoryService } from '@/_bff/modules/yahoo/services/get-cached-price-history.service'
import { failureTag } from '@/_bff/__tests__/utils'

const { fetchHistoryCachedMock } = vi.hoisted(() => ({ fetchHistoryCachedMock: vi.fn() }))

vi.mock('@/_bff/modules/yahoo/processors/fetch-history.processor', () => ({
    fetchHistoryCached: fetchHistoryCachedMock,
}))

describe('getCachedPriceHistoryService', () => {
    beforeEach(() => {
        fetchHistoryCachedMock.mockReset()
    })

    it('returns the cached price history for the ticker', async () => {
        const history = [{ date: '2026-06-01', close: 200 }]
        fetchHistoryCachedMock.mockReturnValue(() => Promise.resolve(history))

        await expect(Effect.runPromise(getCachedPriceHistoryService('AAPL'))).resolves.toEqual(
            history
        )
        expect(fetchHistoryCachedMock).toHaveBeenCalledWith('AAPL')
    })

    it('fails with YahooPriceHistoryError when the upstream fetch rejects', async () => {
        fetchHistoryCachedMock.mockReturnValue(() => Promise.reject(new Error('yahoo down')))

        const exit = await Effect.runPromiseExit(getCachedPriceHistoryService('AAPL'))
        expect(failureTag(exit)).toBe('YahooPriceHistoryError')
    })
})
