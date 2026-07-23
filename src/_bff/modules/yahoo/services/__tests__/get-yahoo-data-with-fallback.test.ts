import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getYahooDataWithFallbackService } from '@/_bff/modules/yahoo/services/get-yahoo-data-with-fallback.service'
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

const FULL_DATA = {
    scores: { value: 1 },
    reports: [{ id: 'r1' }],
    sigDev: { headline: 'dev' },
    financials: { price: 10 },
    fundamentals: { revenue: 100 },
} as unknown as GetYahooDataResult

const EMPTY_DATA: GetYahooDataResult = {
    scores: null,
    reports: [],
    sigDev: null,
    financials: null,
    fundamentals: null,
}

// Minimal client implementing the .from().select().eq().maybeSingle() chain.
const makeSupabase = (maybeSingle: () => Promise<{ data: unknown }>) => {
    const maybeSingleSpy = vi.fn(maybeSingle)
    const supabase = {
        from: () => ({
            select: () => ({
                eq: () => ({ maybeSingle: maybeSingleSpy }),
            }),
        }),
    } as unknown as SupabaseClient
    return { supabase, maybeSingleSpy }
}

describe('getYahooDataWithFallbackService', () => {
    beforeEach(() => {
        getYahooTickerMock.mockReset().mockReturnValue(Effect.succeed('AAPL'))
        getYahooDataMock.mockReset().mockReturnValue(Effect.succeed(FULL_DATA))
    })

    it('fetches fresh data when no Supabase client is provided', async () => {
        const result = await Effect.runPromise(getYahooDataWithFallbackService('apple'))
        expect(result).toEqual({
            ticker: 'AAPL',
            data: FULL_DATA,
            isFresh: true,
        })
        expect(getYahooDataMock).toHaveBeenCalledWith('AAPL')
    })

    it('always fetches fresh data and skips the DB read when everything is fresh', async () => {
        const { supabase, maybeSingleSpy } = makeSupabase(() =>
            Promise.resolve({ data: { id: 'AAPL' } })
        )

        const result = await Effect.runPromise(getYahooDataWithFallbackService('apple', supabase))
        expect(result).toEqual({
            ticker: 'AAPL',
            data: FULL_DATA,
            isFresh: true,
        })
        expect(getYahooDataMock).toHaveBeenCalledWith('AAPL')
        expect(maybeSingleSpy).not.toHaveBeenCalled()
    })

    it('fills missing fields from the DB row when Yahoo returns partial data', async () => {
        const partial = { ...FULL_DATA, financials: null, sigDev: null }
        getYahooDataMock.mockReturnValue(Effect.succeed(partial))
        const row = {
            id: 'AAPL',
            financials: { price: 9 },
            sig_dev: { headline: 'stored dev' },
            scores: { value: 99 },
        }
        const { supabase } = makeSupabase(() => Promise.resolve({ data: row }))

        const result = await Effect.runPromise(getYahooDataWithFallbackService('apple', supabase))
        expect(result).toEqual({
            ticker: 'AAPL',
            data: {
                ...partial,
                financials: row.financials,
                sigDev: row.sig_dev,
            },
            isFresh: true,
        })
    })

    it('falls back to the DB row entirely when the Yahoo fetch fails', async () => {
        getYahooDataMock.mockReturnValue(Effect.fail(new Error('yahoo down')))
        const row = {
            id: 'AAPL',
            scores: { value: 1 },
            reports: [{ id: 'r1' }],
            sig_dev: { headline: 'dev' },
            financials: { price: 10 },
            fundamentals: { revenue: 100 },
        }
        const { supabase } = makeSupabase(() => Promise.resolve({ data: row }))

        const result = await Effect.runPromise(getYahooDataWithFallbackService('apple', supabase))
        expect(result).toEqual({
            ticker: 'AAPL',
            data: {
                scores: row.scores,
                reports: row.reports,
                sigDev: row.sig_dev,
                financials: row.financials,
                fundamentals: row.fundamentals,
            },
            isFresh: false,
        })
    })

    it('marks empty fresh data as not fresh so nothing is persisted', async () => {
        getYahooDataMock.mockReturnValue(Effect.succeed(EMPTY_DATA))
        const { supabase } = makeSupabase(() => Promise.resolve({ data: null }))

        const result = await Effect.runPromise(getYahooDataWithFallbackService('apple', supabase))
        expect(result).toEqual({
            ticker: 'AAPL',
            data: EMPTY_DATA,
            isFresh: false,
        })
    })

    it('resolves to null when Yahoo fails and there is no stored row', async () => {
        getYahooDataMock.mockReturnValue(Effect.fail(new Error('yahoo down')))
        const { supabase } = makeSupabase(() => Promise.resolve({ data: null }))

        const result = await Effect.runPromise(getYahooDataWithFallbackService('apple', supabase))
        expect(result).toBeNull()
    })

    it('resolves to null when Yahoo fails and the Supabase query rejects', async () => {
        getYahooDataMock.mockReturnValue(Effect.fail(new Error('yahoo down')))
        const { supabase } = makeSupabase(() => Promise.reject(new Error('db down')))

        const result = await Effect.runPromise(getYahooDataWithFallbackService('apple', supabase))
        expect(result).toBeNull()
    })

    it('resolves to null when Yahoo fails and no Supabase client is provided', async () => {
        getYahooDataMock.mockReturnValue(Effect.fail(new Error('yahoo down')))

        const result = await Effect.runPromise(getYahooDataWithFallbackService('apple'))
        expect(result).toBeNull()
    })

    it('resolves to null when the ticker resolution fails', async () => {
        getYahooTickerMock.mockReturnValue(Effect.fail(new Error('search down')))

        const result = await Effect.runPromise(getYahooDataWithFallbackService('apple'))
        expect(result).toBeNull()
    })
})
