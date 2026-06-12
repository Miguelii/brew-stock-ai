import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Cause, Effect, Exit, Option } from 'effect'
import { getLatestNews } from '@/backend/modules/finnhub/services/get-latest-news-cached.service'

const { fetchLatestNewsCachedMock, serverEnvMock } = vi.hoisted(() => ({
    fetchLatestNewsCachedMock: vi.fn(),
    serverEnvMock: { NEXT_FINNHUB_API_KEY: 'test-api-key' },
}))

vi.mock('@/env/server', () => ({ ServerEnv: serverEnvMock }))
vi.mock('@/backend/modules/finnhub/processors/fetch-latest-news.processor', () => ({
    fetchLatestNewsCached: fetchLatestNewsCachedMock,
}))

// Extracts the tagged failure of an Exit, or null when the effect succeeded.
const failureTag = <E>(exit: Exit.Exit<unknown, E>): string | null => {
    if (!Exit.isFailure(exit)) return null
    const failure = Cause.failureOption(exit.cause)
    return Option.isSome(failure) ? (failure.value as { _tag: string })._tag : null
}

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
