import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError, SubmitFeedbackError } from '@/services/errors'
import { ErrorCode } from '@/services/error-codes'
import { getSession } from '@/services/auth/get-session'

export const submitFeedback = Effect.fn('submitFeedback')(function* (
    name: string,
    email: string,
    message: string
) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.FEEDBACK_SUBMIT_SB_CLIENT }),
    })

    const user = yield* getSession(supabase).pipe(Effect.catchAll(() => Effect.succeed(null)))

    const { error } = yield* Effect.tryPromise({
        try: () =>
            supabase.from('feedback').insert({
                name,
                email,
                message,
                created_at: 'now()',
                ...(user ? { user_id: user.id } : {}),
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
