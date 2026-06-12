import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { getAdminFeedback } from '@/backend/modules/admin/services/get-admin-feedback.service'
import { failureTag } from '@/backend/__tests__/utils'

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
