import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Cause, Effect, Exit, Option } from 'effect'
import { getAdminStats } from '@/backend/modules/admin/services/get-admin-stats.service'
import { ReportStatus } from '@/types/ReportDTO'

const { createSbAdminClientMock, isSuperAdminMock, countReportsMock, countUsersMock } = vi.hoisted(
    () => ({
        createSbAdminClientMock: vi.fn(),
        isSuperAdminMock: vi.fn(),
        countReportsMock: vi.fn(),
        countUsersMock: vi.fn(),
    })
)

vi.mock('@/lib/utils.server', () => ({ createSbAdminClient: createSbAdminClientMock }))
vi.mock('@/backend/modules/admin/helpers/is-super-admin.helper', () => ({
    isSuperAdmin: isSuperAdminMock,
}))
vi.mock('@/backend/modules/admin/repositories/admin.repository', () => ({
    countReports: countReportsMock,
    countUsers: countUsersMock,
}))

const SUPABASE = { from: vi.fn() }

// Extracts the tagged failure of an Exit, or null when the effect succeeded.
const failureTag = <E>(exit: Exit.Exit<unknown, E>): string | null => {
    if (!Exit.isFailure(exit)) return null
    const failure = Cause.failureOption(exit.cause)
    return Option.isSome(failure) ? (failure.value as { _tag: string })._tag : null
}

describe('getAdminStats', () => {
    beforeEach(() => {
        createSbAdminClientMock.mockReset().mockReturnValue(SUPABASE)
        isSuperAdminMock.mockReset().mockReturnValue(true)
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
        const stats = await Effect.runPromise(getAdminStats('andremcga3@gmail.com'))

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
        isSuperAdminMock.mockReturnValue(false)

        const exit = await Effect.runPromiseExit(getAdminStats('user@example.com'))

        expect(failureTag(exit)).toBe('UnauthenticatedError')
        expect(createSbAdminClientMock).not.toHaveBeenCalled()
        expect(countReportsMock).not.toHaveBeenCalled()
    })
})
