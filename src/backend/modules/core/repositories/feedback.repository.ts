import { Effect } from 'effect'
import { SubmitFeedbackError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import type { SupabaseClient } from '@supabase/supabase-js'

export const insertFeedback = Effect.fn('insertFeedback')(function* (
    supabase: SupabaseClient,
    params: { name: string; email: string; message: string; userId?: string }
) {
    const { error } = yield* Effect.tryPromise({
        try: () =>
            supabase.from('feedback').insert({
                name: params.name,
                email: params.email,
                message: params.message,
                created_at: 'now()',
                ...(params.userId ? { user_id: params.userId } : {}),
            }),
        catch: (cause) =>
            new SubmitFeedbackError({ cause, error_hash: ErrorCode.FEEDBACK_SUBMIT_INSERT }),
    })

    if (error) {
        return yield* new SubmitFeedbackError({
            cause: error,
            error_hash: ErrorCode.FEEDBACK_SUBMIT_INSERT_ERR,
        })
    }
})
