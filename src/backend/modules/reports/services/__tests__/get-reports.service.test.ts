import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Cause, Effect, Exit, Option } from 'effect'
import type { User } from '@supabase/supabase-js'
import { getReports } from '@/backend/modules/reports/services/get-reports.service'

const { createSbServerClientMock, selectUserReportsMock } = vi.hoisted(() => ({
    createSbServerClientMock: vi.fn(),
    selectUserReportsMock: vi.fn(),
}))

vi.mock('@/lib/utils.server', () => ({ createSbServerClient: createSbServerClientMock }))
vi.mock('@/backend/modules/reports/repositories/reports.repository', () => ({
    selectUserReports: selectUserReportsMock,
}))

const USER = { id: 'user-1' } as User
const SUPABASE = { from: vi.fn() }

// Extracts the tagged failure of an Exit, or null when the effect succeeded.
const failureTag = <E>(exit: Exit.Exit<unknown, E>): string | null => {
    if (!Exit.isFailure(exit)) return null
    const failure = Cause.failureOption(exit.cause)
    return Option.isSome(failure) ? (failure.value as { _tag: string })._tag : null
}

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
