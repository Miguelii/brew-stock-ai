import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import type { User } from '@supabase/supabase-js'
import { getReports } from '@/_backend/modules/reports/services/get-reports.service'
import { failureTag } from '@/_backend/__tests__/utils'

const { createSbServerClientMock, selectUserReportsMock } = vi.hoisted(() => ({
    createSbServerClientMock: vi.fn(),
    selectUserReportsMock: vi.fn(),
}))

vi.mock('@/lib/utils.server', () => ({ createSbServerClient: createSbServerClientMock }))
vi.mock('@/_backend/modules/reports/repositories/reports.repository', () => ({
    selectUserReports: selectUserReportsMock,
}))

const USER = { id: 'user-1' } as User
const SUPABASE = { from: vi.fn() }

describe('getReports', () => {
    beforeEach(() => {
        createSbServerClientMock.mockReset().mockResolvedValue(SUPABASE)
        selectUserReportsMock.mockReset().mockReturnValue(Effect.succeed([{ id: 'r-1' }]))
    })

    it('returns the reports for the current user', async () => {
        await expect(Effect.runPromise(getReports(USER))).resolves.toEqual([{ id: 'r-1' }])
        expect(selectUserReportsMock).toHaveBeenCalledWith(SUPABASE, 'user-1')
    })

    it('fails with CreateSbClientError when the Supabase client cannot be created', async () => {
        createSbServerClientMock.mockRejectedValue(new Error('no env'))

        const exit = await Effect.runPromiseExit(getReports(USER))
        expect(failureTag(exit)).toBe('CreateSbClientError')
    })
})
