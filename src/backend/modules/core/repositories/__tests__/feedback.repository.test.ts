import { describe, it, expect, vi } from 'vitest'
import { Cause, Effect, Exit, Option } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import { insertFeedback } from '@/backend/modules/core/repositories/feedback.repository'

const asClient = (from: Record<string, unknown>): SupabaseClient =>
    ({ from: () => from }) as unknown as SupabaseClient

// Extracts the tagged failure of an Exit, or null when the effect succeeded.
const failureTag = <E>(exit: Exit.Exit<unknown, E>): string | null => {
    if (!Exit.isFailure(exit)) return null
    const failure = Cause.failureOption(exit.cause)
    return Option.isSome(failure) ? (failure.value as { _tag: string })._tag : null
}

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
