import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { getAdminReports } from '@/backend/modules/admin/services/get-admin-reports.service'
import { failureTag } from '@/backend/__tests__/utils'

const { createSbAdminClientMock, isSuperAdminMock, selectAdminReportsMock } = vi.hoisted(() => ({
    createSbAdminClientMock: vi.fn(),
    isSuperAdminMock: vi.fn(),
    selectAdminReportsMock: vi.fn(),
}))

vi.mock('@/lib/utils.server', () => ({ createSbAdminClient: createSbAdminClientMock }))
vi.mock('@/backend/modules/admin/helpers/is-super-admin.helper', () => ({
    isSuperAdmin: isSuperAdminMock,
}))
vi.mock('@/backend/modules/admin/repositories/admin.repository', () => ({
    selectAdminReports: selectAdminReportsMock,
}))

const SUPABASE = { from: vi.fn() }

describe('getAdminReports', () => {
    beforeEach(() => {
        createSbAdminClientMock.mockReset().mockReturnValue(SUPABASE)
        isSuperAdminMock.mockReset().mockReturnValue(true)
        selectAdminReportsMock.mockReset().mockReturnValue(Effect.succeed([{ id: 'r-1' }]))
    })

    it('returns the reports for admin callers', async () => {
        const reports = await Effect.runPromise(getAdminReports('andremcga3@gmail.com'))

        expect(reports).toEqual([{ id: 'r-1' }])
        expect(selectAdminReportsMock).toHaveBeenCalledWith(SUPABASE)
    })

    it('fails with UnauthenticatedError for non-admin callers', async () => {
        isSuperAdminMock.mockReturnValue(false)

        const exit = await Effect.runPromiseExit(getAdminReports('user@example.com'))
        expect(failureTag(exit)).toBe('UnauthenticatedError')
        expect(selectAdminReportsMock).not.toHaveBeenCalled()
    })
})
