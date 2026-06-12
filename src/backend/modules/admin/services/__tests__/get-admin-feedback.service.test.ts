import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Cause, Effect, Exit, Option } from 'effect'
import { getAdminFeedback } from '@/backend/modules/admin/services/get-admin-feedback.service'

const { createSbAdminClientMock, isSuperAdminMock, selectAdminFeedbackMock } = vi.hoisted(() => ({
    createSbAdminClientMock: vi.fn(),
    isSuperAdminMock: vi.fn(),
    selectAdminFeedbackMock: vi.fn(),
}))

vi.mock('@/lib/utils.server', () => ({ createSbAdminClient: createSbAdminClientMock }))
vi.mock('@/backend/modules/admin/helpers/is-super-admin.helper', () => ({
    isSuperAdmin: isSuperAdminMock,
}))
vi.mock('@/backend/modules/admin/repositories/admin.repository', () => ({
    selectAdminFeedback: selectAdminFeedbackMock,
}))

const SUPABASE = { from: vi.fn() }

// Extracts the tagged failure of an Exit, or null when the effect succeeded.
const failureTag = <E>(exit: Exit.Exit<unknown, E>): string | null => {
    if (!Exit.isFailure(exit)) return null
    const failure = Cause.failureOption(exit.cause)
    return Option.isSome(failure) ? (failure.value as { _tag: string })._tag : null
}

describe('getAdminFeedback', () => {
    beforeEach(() => {
        createSbAdminClientMock.mockReset().mockReturnValue(SUPABASE)
        isSuperAdminMock.mockReset().mockReturnValue(true)
        selectAdminFeedbackMock.mockReset().mockReturnValue(Effect.succeed([{ id: 'f-1' }]))
    })

    it('returns the feedback entries for admin callers', async () => {
        const feedback = await Effect.runPromise(getAdminFeedback('andremcga3@gmail.com'))

        expect(feedback).toEqual([{ id: 'f-1' }])
        expect(selectAdminFeedbackMock).toHaveBeenCalledWith(SUPABASE)
    })

    it('fails with UnauthenticatedError for non-admin callers', async () => {
        isSuperAdminMock.mockReturnValue(false)

        const exit = await Effect.runPromiseExit(getAdminFeedback('user@example.com'))
        expect(failureTag(exit)).toBe('UnauthenticatedError')
        expect(selectAdminFeedbackMock).not.toHaveBeenCalled()
    })
})
