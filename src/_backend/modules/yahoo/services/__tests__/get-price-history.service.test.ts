import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { getPriceHistory } from '@/_backend/modules/yahoo/services/get-price-history.service'
import { failureTag } from '@/_backend/__tests__/utils'

const { fetchHistoryCachedMock } = vi.hoisted(() => ({ fetchHistoryCachedMock: vi.fn() }))

vi.mock('@/_backend/modules/yahoo/processors/fetch-history.processor', () => ({
    fetchHistoryCached: fetchHistoryCachedMock,
}))

describe('getPriceHistory', () => {
    beforeEach(() => {
        fetchHistoryCachedMock.mockReset()
    })

    it('returns the cached price history for the ticker', async () => {
        const history = [{ date: '2026-06-01', close: 200 }]
        fetchHistoryCachedMock.mockReturnValue(() => Promise.resolve(history))

        await expect(Effect.runPromise(getPriceHistory('AAPL'))).resolves.toEqual(history)
        expect(fetchHistoryCachedMock).toHaveBeenCalledWith('AAPL')
    })

    it('fails with YahooPriceHistoryError when the upstream fetch rejects', async () => {
        fetchHistoryCachedMock.mockReturnValue(() => Promise.reject(new Error('yahoo down')))

        const exit = await Effect.runPromiseExit(getPriceHistory('AAPL'))
        expect(failureTag(exit)).toBe('YahooPriceHistoryError')
    })
})
