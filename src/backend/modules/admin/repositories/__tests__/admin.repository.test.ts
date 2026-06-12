import { describe, it, expect, vi } from 'vitest'
import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ReportStatus } from '@/types/ReportDTO'
import { failureTag } from '@/backend/__tests__/utils'
import {
    countReports,
    countUsers,
    listUsers,
    selectAdminFeedback,
    selectAdminReports,
} from '@/backend/modules/admin/repositories/admin.repository'

describe('countReports', () => {
    const makeCountChain = (count: number | null) => {
        const eq = vi.fn().mockResolvedValue({ count })
        const builder = Object.assign(Promise.resolve({ count }), { eq })
        const select = vi.fn(() => builder)
        return { eq, select, supabase: { from: () => ({ select }) } as unknown as SupabaseClient }
    }

    it('counts all reports when no status is given', async () => {
        const { eq, supabase } = makeCountChain(10)

        await expect(Effect.runPromise(countReports(supabase))).resolves.toBe(10)
        expect(eq).not.toHaveBeenCalled()
    })

    it('filters the count by status when given', async () => {
        const { eq, supabase } = makeCountChain(10)

        await expect(Effect.runPromise(countReports(supabase, ReportStatus.FAILED))).resolves.toBe(
            10
        )
        expect(eq).toHaveBeenCalledWith('status', ReportStatus.FAILED)
    })

    it('defaults to 0 when the count is missing', async () => {
        const { supabase } = makeCountChain(null)

        await expect(Effect.runPromise(countReports(supabase))).resolves.toBe(0)
    })
})

describe('countUsers', () => {
    const asAuthClient = (listUsersImpl: ReturnType<typeof vi.fn>): SupabaseClient =>
        ({ auth: { admin: { listUsers: listUsersImpl } } }) as unknown as SupabaseClient

    it('returns the total from the users listing', async () => {
        const list = vi.fn().mockResolvedValue({ data: { total: 42, users: [] } })

        await expect(Effect.runPromise(countUsers(asAuthClient(list)))).resolves.toBe(42)
        expect(list).toHaveBeenCalledWith({ perPage: 1 })
    })

    it('returns 0 when the response carries no total', async () => {
        const list = vi.fn().mockResolvedValue({ data: { users: [] } })

        await expect(Effect.runPromise(countUsers(asAuthClient(list)))).resolves.toBe(0)
    })

    it('fails with AdminStatsError when the listing rejects', async () => {
        const list = vi.fn().mockRejectedValue(new Error('admin api down'))

        const exit = await Effect.runPromiseExit(countUsers(asAuthClient(list)))
        expect(failureTag(exit)).toBe('AdminStatsError')
    })
})

describe('listUsers', () => {
    it('returns the first page of up to 1000 users', async () => {
        const users = [{ id: 'u-1' }, { id: 'u-2' }]
        const list = vi.fn().mockResolvedValue({ data: { users } })
        const supabase = { auth: { admin: { listUsers: list } } } as unknown as SupabaseClient

        await expect(Effect.runPromise(listUsers(supabase))).resolves.toEqual(users)
        expect(list).toHaveBeenCalledWith({ perPage: 1000, page: 1 })
    })
})

describe('selectAdminReports', () => {
    const makeListChain = (result: { data: unknown; error: unknown }) => {
        const limit = vi.fn().mockResolvedValue(result)
        const order = vi.fn(() => ({ limit }))
        const select = vi.fn(() => ({ order }))
        return { from: () => ({ select }) } as unknown as SupabaseClient
    }

    it('returns the latest reports', async () => {
        const rows = [{ id: 'r-1' }]
        const supabase = makeListChain({ data: rows, error: null })

        await expect(Effect.runPromise(selectAdminReports(supabase))).resolves.toEqual(rows)
    })

    it('fails with AdminStatsError when the query returns an error', async () => {
        const supabase = makeListChain({ data: null, error: { message: 'boom' } })

        const exit = await Effect.runPromiseExit(selectAdminReports(supabase))
        expect(failureTag(exit)).toBe('AdminStatsError')
    })
})

describe('selectAdminFeedback', () => {
    const makeListChain = (result: { data: unknown; error: unknown }) => {
        const limit = vi.fn().mockResolvedValue(result)
        const order = vi.fn(() => ({ limit }))
        const select = vi.fn(() => ({ order }))
        return { from: () => ({ select }) } as unknown as SupabaseClient
    }

    it('returns the latest feedback entries', async () => {
        const rows = [{ id: 'f-1' }]
        const supabase = makeListChain({ data: rows, error: null })

        await expect(Effect.runPromise(selectAdminFeedback(supabase))).resolves.toEqual(rows)
    })

    it('fails with GetAdminFeedbackError when the query returns an error', async () => {
        const supabase = makeListChain({ data: null, error: { message: 'boom' } })

        const exit = await Effect.runPromiseExit(selectAdminFeedback(supabase))
        expect(failureTag(exit)).toBe('GetAdminFeedbackError')
    })
})
