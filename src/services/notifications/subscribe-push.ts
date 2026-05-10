import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import {
    CreateSbClientError,
    SavePushSubscriptionError,
    UnauthenticatedError,
} from '@/services/errors'
import { ErrorCode } from '@/services/error-codes'
import { getSession } from '@/services/auth/get-session'

export const subscribePush = Effect.fn('subscribePush')(function* (
    subscription: PushSubscriptionJSON
) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(true),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.PUSH_SUBSCRIBE_SB_CLIENT }),
    })

    const user = yield* getSession(supabase)

    if (!user) {
        return yield* new UnauthenticatedError({ error_hash: ErrorCode.PUSH_SUBSCRIBE_UNAUTH })
    }

    const { error } = yield* Effect.tryPromise({
        try: () =>
            supabase
                .from('push_subscriptions')
                .upsert({ user_id: user.id, subscription }, { onConflict: 'user_id' }),
        catch: (cause) =>
            new SavePushSubscriptionError({ cause, error_hash: ErrorCode.PUSH_SUBSCRIBE_SAVE }),
    })

    if (error) {
        return yield* new SavePushSubscriptionError({
            cause: error,
            error_hash: ErrorCode.PUSH_SUBSCRIBE_SAVE_ERR,
        })
    }

    return { success: true }
})
