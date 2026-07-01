import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { getLatestNewsService } from '@/_backend/modules/finnhub/services/get-latest-news.service'
import { failureTag } from '@/_backend/__tests__/utils'

const { fetchLatestNewsRawMock, serverEnvMock } = vi.hoisted(() => ({
    fetchLatestNewsRawMock: vi.fn(),
    serverEnvMock: { NEXT_FINNHUB_API_KEY: 'test-api-key' },
}))

vi.mock('@/env/server', () => ({ ServerEnv: serverEnvMock }))
vi.mock('@/_backend/modules/finnhub/processors/fetch-latest-news.processor', () => ({
    fetchLatestNewsRaw: fetchLatestNewsRawMock,
}))

describe('getLatestNewsService (raw)', () => {
    beforeEach(() => {
        serverEnvMock.NEXT_FINNHUB_API_KEY = 'test-api-key'
        fetchLatestNewsRawMock.mockReset()
    })

    it('returns the raw news for the ticker', async () => {
        const items = [{ headline: 'AAPL up' }]
        fetchLatestNewsRawMock.mockResolvedValue(items)

        await expect(Effect.runPromise(getLatestNewsService('AAPL'))).resolves.toEqual(items)
        expect(fetchLatestNewsRawMock).toHaveBeenCalledWith('AAPL')
    })

    it('fails with LatestNewsError when the API key is missing', async () => {
        serverEnvMock.NEXT_FINNHUB_API_KEY = ''

        const exit = await Effect.runPromiseExit(getLatestNewsService('AAPL'))
        expect(failureTag(exit)).toBe('LatestNewsError')
        expect(fetchLatestNewsRawMock).not.toHaveBeenCalled()
    })
})
