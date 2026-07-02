import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { getAdminReports } from '@/_bff/modules/admin/services/get-admin-reports.service'
import { failureTag } from '@/_bff/__tests__/utils'

const { createSbAdminClientMock, isAdminMock, selectAdminReportsMock } = vi.hoisted(() => ({
    createSbAdminClientMock: vi.fn(),
    isAdminMock: vi.fn(),
    selectAdminReportsMock: vi.fn(),
}))

vi.mock('@/lib/utils.server', () => ({ createSbAdminClient: createSbAdminClientMock }))
vi.mock('@/_bff/modules/admin/services/is-admin.service', () => ({
    isAdmin: isAdminMock,
}))
vi.mock('@/_bff/modules/admin/repositories/admin.repository', () => ({
    selectAdminReports: selectAdminReportsMock,
}))

const SUPABASE = { from: vi.fn() }

describe('getAdminReports', () => {
    beforeEach(() => {
        createSbAdminClientMock.mockReset().mockReturnValue(SUPABASE)
        isAdminMock.mockReset().mockReturnValue(Effect.succeed(true))
        selectAdminReportsMock.mockReset().mockReturnValue(Effect.succeed([{ id: 'r-1' }]))
    })

    it('returns the reports for admin callers', async () => {
        const reports = await Effect.runPromise(getAdminReports())

        expect(reports).toEqual([{ id: 'r-1' }])
        expect(selectAdminReportsMock).toHaveBeenCalledWith(SUPABASE)
    })

    it('fails with UnauthenticatedError for non-admin callers', async () => {
        isAdminMock.mockReturnValue(Effect.succeed(false))

        const exit = await Effect.runPromiseExit(getAdminReports())
        expect(failureTag(exit)).toBe('UnauthenticatedError')
        expect(selectAdminReportsMock).not.toHaveBeenCalled()
    })
})
