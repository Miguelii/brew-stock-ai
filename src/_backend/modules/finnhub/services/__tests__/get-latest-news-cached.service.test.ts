import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { getLatestNews } from '@/_backend/modules/finnhub/services/get-latest-news-cached.service'
import { failureTag } from '@/_backend/__tests__/utils'

const { fetchLatestNewsCachedMock, serverEnvMock } = vi.hoisted(() => ({
    fetchLatestNewsCachedMock: vi.fn(),
    serverEnvMock: { NEXT_FINNHUB_API_KEY: 'test-api-key' },
}))

vi.mock('@/env/server', () => ({ ServerEnv: serverEnvMock }))
vi.mock('@/_backend/modules/finnhub/processors/fetch-latest-news.processor', () => ({
    fetchLatestNewsCached: fetchLatestNewsCachedMock,
}))

describe('getLatestNews (cached)', () => {
    beforeEach(() => {
        serverEnvMock.NEXT_FINNHUB_API_KEY = 'test-api-key'
        fetchLatestNewsCachedMock.mockReset()
    })

    it('returns the cached news for the ticker', async () => {
        const items = [{ headline: 'AAPL up' }]
        fetchLatestNewsCachedMock.mockReturnValue(() => Promise.resolve(items))

        await expect(Effect.runPromise(getLatestNews('AAPL'))).resolves.toEqual(items)
        expect(fetchLatestNewsCachedMock).toHaveBeenCalledWith('AAPL')
    })

    it('fails with LatestNewsError when the API key is missing', async () => {
        serverEnvMock.NEXT_FINNHUB_API_KEY = ''

        const exit = await Effect.runPromiseExit(getLatestNews('AAPL'))
        expect(failureTag(exit)).toBe('LatestNewsError')
        expect(fetchLatestNewsCachedMock).not.toHaveBeenCalled()
    })

    it('fails with LatestNewsError when the upstream fetch rejects', async () => {
        fetchLatestNewsCachedMock.mockReturnValue(() => Promise.reject(new Error('finnhub down')))

        const exit = await Effect.runPromiseExit(getLatestNews('AAPL'))
        expect(failureTag(exit)).toBe('LatestNewsError')
    })
})
