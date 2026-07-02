import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { getAdminStats } from '@/_bff/modules/admin/services/get-admin-stats.service'
import { ReportStatus } from '@/types/ReportDTO'
import { failureTag } from '@/_bff/__tests__/utils'

const { createSbAdminClientMock, isAdminMock, countReportsMock, countUsersMock } = vi.hoisted(
    () => ({
        createSbAdminClientMock: vi.fn(),
        isAdminMock: vi.fn(),
        countReportsMock: vi.fn(),
        countUsersMock: vi.fn(),
    })
)

vi.mock('@/lib/utils.server', () => ({ createSbAdminClient: createSbAdminClientMock }))
vi.mock('@/_bff/modules/admin/services/is-admin.service', () => ({
    isAdmin: isAdminMock,
}))
vi.mock('@/_bff/modules/admin/repositories/admin.repository', () => ({
    countReports: countReportsMock,
    countUsers: countUsersMock,
}))

const SUPABASE = { from: vi.fn() }

describe('getAdminStats', () => {
    beforeEach(() => {
        createSbAdminClientMock.mockReset().mockReturnValue(SUPABASE)
        isAdminMock.mockReset().mockReturnValue(Effect.succeed(true))
        countReportsMock
            .mockReset()
            .mockImplementation((_supabase, status?: ReportStatus) =>
                Effect.succeed(
                    status === ReportStatus.COMPLETED ? 8 : status === ReportStatus.FAILED ? 2 : 10
                )
            )
        countUsersMock.mockReset().mockReturnValue(Effect.succeed(5))
    })

    it('aggregates total, completed, failed and user counts', async () => {
        const stats = await Effect.runPromise(getAdminStats())

        expect(stats).toEqual({
            totalReports: 10,
            completedReports: 8,
            failedReports: 2,
            totalUsers: 5,
        })
        expect(countReportsMock).toHaveBeenCalledWith(SUPABASE)
        expect(countReportsMock).toHaveBeenCalledWith(SUPABASE, ReportStatus.COMPLETED)
        expect(countReportsMock).toHaveBeenCalledWith(SUPABASE, ReportStatus.FAILED)
    })

    it('fails with UnauthenticatedError for non-admin callers without touching the database', async () => {
        isAdminMock.mockReturnValue(Effect.succeed(false))

        const exit = await Effect.runPromiseExit(getAdminStats())

        expect(failureTag(exit)).toBe('UnauthenticatedError')
        expect(createSbAdminClientMock).not.toHaveBeenCalled()
        expect(countReportsMock).not.toHaveBeenCalled()
    })
})
