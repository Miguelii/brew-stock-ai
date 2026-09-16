import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { getAdminFeedback } from '@/_bff/modules/admin/services/get-admin-feedback.service'
import { failureTag } from '@/_bff/__tests__/utils'

const { createDBAdminClientMock, isAdminMock, selectAdminFeedbackMock } = vi.hoisted(() => ({
    createDBAdminClientMock: vi.fn(),
    isAdminMock: vi.fn(),
    selectAdminFeedbackMock: vi.fn(),
}))

vi.mock('@/_bff/core/db', () => ({
    createDBAdminClient: createDBAdminClientMock,
}))
vi.mock('@/_bff/modules/admin/services/is-admin.service', () => ({
    isAdmin: isAdminMock,
}))
vi.mock('@/_bff/modules/admin/repositories/admin.repository', () => ({
    selectAdminFeedback: selectAdminFeedbackMock,
}))

const SUPABASE = { from: vi.fn() }

describe('getAdminFeedback', () => {
    beforeEach(() => {
        createDBAdminClientMock.mockReset().mockReturnValue(SUPABASE)
        isAdminMock.mockReset().mockReturnValue(Effect.succeed(true))
        selectAdminFeedbackMock.mockReset().mockReturnValue(Effect.succeed([{ id: 'f-1' }]))
    })

    it('returns the feedback entries for admin callers', async () => {
        const feedback = await Effect.runPromise(getAdminFeedback())

        expect(feedback).toEqual([{ id: 'f-1' }])
        expect(selectAdminFeedbackMock).toHaveBeenCalledWith(SUPABASE)
    })

    it('fails with UnauthenticatedError for non-admin callers', async () => {
        isAdminMock.mockReturnValue(Effect.succeed(false))

        const exit = await Effect.runPromiseExit(getAdminFeedback())
        expect(failureTag(exit)).toBe('UnauthenticatedError')
        expect(selectAdminFeedbackMock).not.toHaveBeenCalled()
    })
})
