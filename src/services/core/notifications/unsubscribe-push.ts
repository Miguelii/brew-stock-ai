import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import {
    CreateSbClientError,
    DeletePushSubscriptionError,
    UnauthenticatedError,
} from '@/services/lib/errors'
import { ErrorCode } from '@/services/lib/error-codes'
import { getSession } from '@/services/core/auth/get-session'

export const unsubscribePush = Effect.fn('unsubscribePush')(function* () {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.PUSH_UNSUBSCRIBE_SB_CLIENT }),
    })

    const user = yield* getSession(supabase)

    if (!user) {
        return yield* new UnauthenticatedError({ error_hash: ErrorCode.PUSH_UNSUBSCRIBE_UNAUTH })
    }

    const { error } = yield* Effect.tryPromise({
        try: () => supabase.from('push_subscriptions').delete().eq('user_id', user.id),
        catch: (cause) =>
            new DeletePushSubscriptionError({
                cause,
                error_hash: ErrorCode.PUSH_UNSUBSCRIBE_DELETE,
            }),
    })

    if (error) {
        return yield* new DeletePushSubscriptionError({
            cause: error,
            error_hash: ErrorCode.PUSH_UNSUBSCRIBE_DELETE_ERR,
        })
    }

    return { success: true }
})
