import { describe, it, expect, vi } from 'vitest'
import { Effect } from 'effect'
import { insertFeedback } from '@/_backend/modules/core/repositories/feedback.repository'
import { failureTag, asClient } from '@/_backend/__tests__/utils'

describe('insertFeedback', () => {
    it('inserts the feedback with the user id when present', async () => {
        const insert = vi.fn().mockResolvedValue({ error: null })
        const supabase = asClient({ insert })

        await Effect.runPromise(
            insertFeedback(supabase, {
                name: 'Jane',
                email: 'jane@example.com',
                message: 'Great product',
                userId: 'user-1',
            })
        )

        expect(insert).toHaveBeenCalledWith({
            name: 'Jane',
            email: 'jane@example.com',
            message: 'Great product',
            created_at: 'now()',
            user_id: 'user-1',
        })
    })

    it('omits user_id for anonymous feedback', async () => {
        const insert = vi.fn().mockResolvedValue({ error: null })
        const supabase = asClient({ insert })

        await Effect.runPromise(
            insertFeedback(supabase, {
                name: 'Jane',
                email: 'jane@example.com',
                message: 'Great product',
            })
        )

        expect(insert).toHaveBeenCalledWith({
            name: 'Jane',
            email: 'jane@example.com',
            message: 'Great product',
            created_at: 'now()',
        })
    })

    it('fails with SubmitFeedbackError when the insert returns an error', async () => {
        const insert = vi.fn().mockResolvedValue({ error: { message: 'boom' } })
        const supabase = asClient({ insert })

        const exit = await Effect.runPromiseExit(
            insertFeedback(supabase, {
                name: 'Jane',
                email: 'jane@example.com',
                message: 'Great product',
            })
        )
        expect(failureTag(exit)).toBe('SubmitFeedbackError')
    })
})
