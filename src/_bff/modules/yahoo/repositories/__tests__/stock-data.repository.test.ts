import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
    selectStockData,
    upsertStockData,
} from '@/_bff/modules/yahoo/repositories/stock-data.repository'
import type { GetYahooDataResult } from '@/_bff/modules/yahoo/types'
import { failureTag } from '@/_bff/__tests__/utils'

vi.mock('@trigger.dev/sdk', () => ({ logger: { log: vi.fn() } }))

const DATA: GetYahooDataResult = {
    scores: { value: 1 },
    reports: [],
    sigDev: null,
    financials: null,
    fundamentals: null,
} as unknown as GetYahooDataResult

describe('selectStockData', () => {
    it('returns the raw response for the ticker', async () => {
        const row = { id: 'AAPL', last_update_at: '2026-06-01' }
        const maybeSingle = vi.fn().mockResolvedValue({ data: row })
        const eq = vi.fn(() => ({ maybeSingle }))
        const select = vi.fn(() => ({ eq }))
        const supabase = { from: () => ({ select }) } as unknown as SupabaseClient

        const res = await Effect.runPromise(selectStockData(supabase, 'AAPL'))
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
                scores: DATA.scores,
                last_update_at: '2026-06-12T00:00:00.000Z',
            },
            { onConflict: 'id' }
        )
    })

    it('omits empty sections from the payload when there is no stock data', async () => {
        const { upsert, supabase } = makeUpsertChain({ error: null })

        await Effect.runPromise(upsertStockData(supabase, 'AAPL', { ...DATA, scores: null }))

        const payload = upsert.mock.calls[0][0]
        expect(payload).toEqual({
            id: 'AAPL',
            last_update_at: '2026-06-12T00:00:00.000Z',
        })
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
