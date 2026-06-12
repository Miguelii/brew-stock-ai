import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Cause, Effect, Exit, Option } from 'effect'
import { getPriceHistory } from '@/backend/modules/yahoo/services/get-price-history.service'

const { fetchHistoryCachedMock } = vi.hoisted(() => ({ fetchHistoryCachedMock: vi.fn() }))

vi.mock('@/backend/modules/yahoo/processors/fetch-history.processor', () => ({
    fetchHistoryCached: fetchHistoryCachedMock,
}))

// Extracts the tagged failure of an Exit, or null when the effect succeeded.
const failureTag = <E>(exit: Exit.Exit<unknown, E>): string | null => {
    if (!Exit.isFailure(exit)) return null
    const failure = Cause.failureOption(exit.cause)
    return Option.isSome(failure) ? (failure.value as { _tag: string })._tag : null
}

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
