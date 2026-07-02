import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Effect } from 'effect'
import { submitFeedback } from '@/_bff/modules/core/services/submit-feedback.service'

const { createSbServerClientMock, getSessionMock, insertFeedbackMock } = vi.hoisted(() => ({
    createSbServerClientMock: vi.fn(),
    getSessionMock: vi.fn(),
    insertFeedbackMock: vi.fn(),
}))

vi.mock('@/lib/utils.server', () => ({ createSbServerClient: createSbServerClientMock }))
vi.mock('@/_bff/modules/auth/services/get-session.service', () => ({
    getSession: getSessionMock,
}))
vi.mock('@/_bff/modules/core/repositories/feedback.repository', () => ({
    insertFeedback: insertFeedbackMock,
}))

const SUPABASE = { from: vi.fn() }

describe('submitFeedback', () => {
    beforeEach(() => {
        createSbServerClientMock.mockReset().mockResolvedValue(SUPABASE)
        getSessionMock.mockReset().mockReturnValue(Effect.succeed({ id: 'user-1' }))
        insertFeedbackMock.mockReset().mockReturnValue(Effect.void)
    })

    it('attaches the user id when a session exists', async () => {
        await Effect.runPromise(submitFeedback('Jane', 'jane@example.com', 'Great product'))

        expect(insertFeedbackMock).toHaveBeenCalledWith(SUPABASE, {
            name: 'Jane',
            email: 'jane@example.com',
            message: 'Great product',
            userId: 'user-1',
        })
    })

    it('submits anonymously when there is no session', async () => {
        getSessionMock.mockReturnValue(Effect.succeed(null))

        await Effect.runPromise(submitFeedback('Jane', 'jane@example.com', 'Great product'))

        expect(insertFeedbackMock).toHaveBeenCalledWith(SUPABASE, {
            name: 'Jane',
            email: 'jane@example.com',
            message: 'Great product',
            userId: undefined,
        })
    })

    it('still submits when the session lookup fails', async () => {
        getSessionMock.mockReturnValue(Effect.fail({ _tag: 'GetUserError' }))

        await Effect.runPromise(submitFeedback('Jane', 'jane@example.com', 'Great product'))

        expect(insertFeedbackMock).toHaveBeenCalledWith(
            SUPABASE,
            expect.objectContaining({ userId: undefined })
        )
    })
})
