import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchLatestNewsRaw } from '@/_backend/modules/finnhub/processors/fetch-latest-news.processor'

vi.mock('@/env/server', () => ({
    ServerEnv: {
        NEXT_FINNHUB_BASE_URL: 'https://finnhub.test/api/v1',
        NEXT_FINNHUB_API_KEY: 'test-api-key',
    },
}))
vi.mock('next/cache', () => ({
    unstable_cache: vi.fn((fn: () => unknown) => fn),
}))

const fetchMock = vi.fn()

const jsonResponse = (body: unknown, init: { ok?: boolean; status?: number } = {}) =>
    Promise.resolve({
        ok: init.ok ?? true,
        status: init.status ?? 200,
        json: () => Promise.resolve(body),
    })

describe('fetchLatestNewsRaw', () => {
    beforeEach(() => {
        fetchMock.mockReset()
        vi.stubGlobal('fetch', fetchMock)
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2026-06-10T12:00:00Z'))
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.unstubAllGlobals()
    })

    it('requests company news for the past year with the ticker and API token', async () => {
        fetchMock.mockReturnValue(jsonResponse([]))

        await fetchLatestNewsRaw('AAPL')
        expect(fetchMock).toHaveBeenCalledWith(
            'https://finnhub.test/api/v1/company-news?symbol=AAPL&from=2025-06-10&to=2026-06-10&token=test-api-key',
            expect.objectContaining({ signal: expect.any(AbortSignal) })
        )
    })

    it('returns only the 3 most recent items of a larger response', async () => {
        const items = Array.from({ length: 10 }, (_, i) => ({ id: i }))
        fetchMock.mockReturnValue(jsonResponse(items))

        const result = await fetchLatestNewsRaw('AAPL')
        expect(result).toEqual([{ id: 0 }, { id: 1 }, { id: 2 }])
    })

    it('returns the full array when it has 3 items or fewer', async () => {
        const items = [{ id: 0 }, { id: 1 }]
        fetchMock.mockReturnValue(jsonResponse(items))

        await expect(fetchLatestNewsRaw('AAPL')).resolves.toEqual(items)
    })

    it('throws when the response is not an array', async () => {
        fetchMock.mockReturnValue(jsonResponse({ error: 'rate limited' }))

        await expect(fetchLatestNewsRaw('AAPL')).rejects.toThrow(
            'Unexpected news response for AAPL'
        )
    })

    it('throws when the response status is not ok', async () => {
        fetchMock.mockReturnValue(jsonResponse([], { ok: false, status: 429 }))

        await expect(fetchLatestNewsRaw('AAPL')).rejects.toThrow(
            'Finnhub news request failed for AAPL: 429'
        )
    })
})
