import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import { getSession } from '@/_bff/modules/auth/services/get-session.service'
import { insertFeedback } from '@/_bff/modules/core/repositories/feedback.repository'

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

    yield* insertFeedback(supabase, { name, email, message, userId: user?.id })
})
