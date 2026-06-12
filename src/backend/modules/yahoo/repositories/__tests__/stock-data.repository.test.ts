import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Cause, Effect, Exit, Option } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
    selectStockDataWithTtl,
    upsertStockData,
} from '@/backend/modules/yahoo/repositories/stock-data.repository'
import type { GetYahooDataResult } from '@/backend/modules/yahoo/types'

vi.mock('@trigger.dev/sdk', () => ({ logger: { log: vi.fn() } }))

const DATA: GetYahooDataResult = {
    scores: { value: 1 },
    reports: [],
    sigDev: null,
    financials: null,
    fundamentals: null,
} as unknown as GetYahooDataResult

// Extracts the tagged failure of an Exit, or null when the effect succeeded.
const failureTag = <E>(exit: Exit.Exit<unknown, E>): string | null => {
    if (!Exit.isFailure(exit)) return null
    const failure = Cause.failureOption(exit.cause)
    return Option.isSome(failure) ? (failure.value as { _tag: string })._tag : null
}

describe('selectStockDataWithTtl', () => {
    it('returns the raw response with the TTL column', async () => {
        const row = { id: 'AAPL', last_update_at: '2026-06-01' }
        const maybeSingle = vi.fn().mockResolvedValue({ data: row })
        const eq = vi.fn(() => ({ maybeSingle }))
        const select = vi.fn(() => ({ eq }))
        const supabase = { from: () => ({ select }) } as unknown as SupabaseClient

        const res = await Effect.runPromise(selectStockDataWithTtl(supabase, 'AAPL'))
        expect(res.data).toEqual(row)
        expect(select).toHaveBeenCalledWith('*, last_update_at')
        expect(eq).toHaveBeenCalledWith('id', 'AAPL')
    })
})

describe('upsertStockData', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2026-06-12T00:00:00Z'))
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    const makeUpsertChain = (result: { error: unknown }) => {
        const upsert = vi.fn().mockResolvedValue(result)
        return { upsert, supabase: { from: () => ({ upsert }) } as unknown as SupabaseClient }
    }

    it('upserts the row keyed by ticker with a fresh last_update_at', async () => {
        const { upsert, supabase } = makeUpsertChain({ error: null })

        await Effect.runPromise(upsertStockData(supabase, 'AAPL', DATA))

        expect(upsert).toHaveBeenCalledWith(
            {
                id: 'AAPL',
                reports: DATA.reports,
                scores: DATA.scores,
                sig_dev: DATA.sigDev,
                financials: null,
                fundamentals: null,
                last_update_at: '2026-06-12T00:00:00.000Z',
            },
            { onConflict: 'id' }
        )
    })

    it('fails with SaveStockDataError when the upsert returns an error', async () => {
        const { supabase } = makeUpsertChain({ error: { message: 'boom' } })

        const exit = await Effect.runPromiseExit(upsertStockData(supabase, 'AAPL', DATA))
        expect(failureTag(exit)).toBe('SaveStockDataError')
    })

    it('fails with SaveStockDataError when the upsert rejects', async () => {
        const upsert = vi.fn().mockRejectedValue(new Error('network down'))
        const supabase = { from: () => ({ upsert }) } as unknown as SupabaseClient

        const exit = await Effect.runPromiseExit(upsertStockData(supabase, 'AAPL', DATA))
        expect(failureTag(exit)).toBe('SaveStockDataError')
    })
})
