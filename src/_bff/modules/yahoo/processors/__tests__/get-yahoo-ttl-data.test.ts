import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getYahooTtlData } from '@/_bff/modules/yahoo/processors/get-yahoo-ttl-data.processor'
import { YAHOO_DATA_TTL } from '@/_bff/modules/yahoo/constants'
import type { GetYahooDataResult } from '@/_bff/modules/yahoo/types'

const { getYahooTickerMock, getYahooDataMock } = vi.hoisted(() => ({
    getYahooTickerMock: vi.fn(),
    getYahooDataMock: vi.fn(),
}))

vi.mock('@/_bff/modules/yahoo/processors/get-yahoo-ticker.processor', () => ({
    getYahooTicker: getYahooTickerMock,
}))
vi.mock('@/_bff/modules/yahoo/processors/get-yahoo-data.processor', () => ({
    getYahooData: getYahooDataMock,
}))

const FRESH_DATA: GetYahooDataResult = {
    scores: null,
    reports: [],
    sigDev: null,
    financials: null,
    fundamentals: null,
}

// Minimal client implementing the .from().select().eq().maybeSingle() chain.
const makeSupabase = (maybeSingle: () => Promise<{ data: unknown }>): SupabaseClient =>
    ({
        from: () => ({
            select: () => ({
                eq: () => ({ maybeSingle }),
            }),
        }),
    }) as unknown as SupabaseClient

describe('getYahooTtlData', () => {
    beforeEach(() => {
        getYahooTickerMock.mockReset().mockReturnValue(Effect.succeed('AAPL'))
        getYahooDataMock.mockReset().mockReturnValue(Effect.succeed(FRESH_DATA))
    })

    it('fetches fresh data when no Supabase client is provided', async () => {
        const result = await Effect.runPromise(getYahooTtlData('apple'))
        expect(result).toEqual({ ticker: 'AAPL', data: FRESH_DATA, isFresh: true })
        expect(getYahooDataMock).toHaveBeenCalledWith('AAPL')
    })

    it('returns the cached row without refetching when it is within the TTL', async () => {
        const row = {
            id: 'AAPL',
            last_update_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            scores: { value: 1 },
        }
        const supabase = makeSupabase(() => Promise.resolve({ data: row }))

        const result = await Effect.runPromise(getYahooTtlData('apple', supabase))
        expect(result).toEqual({ ticker: 'AAPL', data: row, isFresh: false })
        expect(getYahooDataMock).not.toHaveBeenCalled()
    })

    it('refetches when the cached row is older than the TTL', async () => {
        const row = {
            id: 'AAPL',
            last_update_at: new Date(Date.now() - YAHOO_DATA_TTL - 1000).toISOString(),
        }
        const supabase = makeSupabase(() => Promise.resolve({ data: row }))

        const result = await Effect.runPromise(getYahooTtlData('apple', supabase))
        expect(result).toEqual({ ticker: 'AAPL', data: FRESH_DATA, isFresh: true })
        expect(getYahooDataMock).toHaveBeenCalledWith('AAPL')
    })

    it('treats a missing cache row as stale and fetches fresh data', async () => {
        const supabase = makeSupabase(() => Promise.resolve({ data: null }))

        const result = await Effect.runPromise(getYahooTtlData('apple', supabase))
        expect(result).toEqual({ ticker: 'AAPL', data: FRESH_DATA, isFresh: true })
    })

    it('treats a row without last_update_at as stale and fetches fresh data', async () => {
        const supabase = makeSupabase(() => Promise.resolve({ data: { id: 'AAPL' } }))

        const result = await Effect.runPromise(getYahooTtlData('apple', supabase))
        expect(result).toEqual({ ticker: 'AAPL', data: FRESH_DATA, isFresh: true })
    })

    it('falls back to a fresh fetch when the Supabase query rejects', async () => {
        const supabase = makeSupabase(() => Promise.reject(new Error('db down')))

        const result = await Effect.runPromise(getYahooTtlData('apple', supabase))
        expect(result).toEqual({ ticker: 'AAPL', data: FRESH_DATA, isFresh: true })
    })

    it('resolves to null when the ticker resolution fails', async () => {
        getYahooTickerMock.mockReturnValue(Effect.fail(new Error('search down')))

        const result = await Effect.runPromise(getYahooTtlData('apple'))
        expect(result).toBeNull()
    })
})
