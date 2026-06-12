import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Cause, Effect, Exit, Option } from 'effect'
import { getLatestNewsService } from '@/backend/modules/finnhub/services/get-latest-news.service'

const { fetchLatestNewsRawMock, serverEnvMock } = vi.hoisted(() => ({
    fetchLatestNewsRawMock: vi.fn(),
    serverEnvMock: { NEXT_FINNHUB_API_KEY: 'test-api-key' },
}))

vi.mock('@/env/server', () => ({ ServerEnv: serverEnvMock }))
vi.mock('@/backend/modules/finnhub/processors/fetch-latest-news.processor', () => ({
    fetchLatestNewsRaw: fetchLatestNewsRawMock,
}))

// Extracts the tagged failure of an Exit, or null when the effect succeeded.
const failureTag = <E>(exit: Exit.Exit<unknown, E>): string | null => {
    if (!Exit.isFailure(exit)) return null
    const failure = Cause.failureOption(exit.cause)
    return Option.isSome(failure) ? (failure.value as { _tag: string })._tag : null
}

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
