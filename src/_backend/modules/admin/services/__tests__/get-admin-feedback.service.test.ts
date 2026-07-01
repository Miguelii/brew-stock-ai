import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { getAdminFeedback } from '@/_backend/modules/admin/services/get-admin-feedback.service'
import { failureTag } from '@/_backend/__tests__/utils'

const { createSbAdminClientMock, isAdminMock, selectAdminFeedbackMock } = vi.hoisted(() => ({
    createSbAdminClientMock: vi.fn(),
    isAdminMock: vi.fn(),
    selectAdminFeedbackMock: vi.fn(),
}))

vi.mock('@/lib/utils.server', () => ({ createSbAdminClient: createSbAdminClientMock }))
vi.mock('@/_backend/modules/admin/services/is-admin.service', () => ({
    isAdmin: isAdminMock,
}))
vi.mock('@/_backend/modules/admin/repositories/admin.repository', () => ({
    selectAdminFeedback: selectAdminFeedbackMock,
}))

const SUPABASE = { from: vi.fn() }

describe('getAdminFeedback', () => {
    beforeEach(() => {
        createSbAdminClientMock.mockReset().mockReturnValue(SUPABASE)
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
