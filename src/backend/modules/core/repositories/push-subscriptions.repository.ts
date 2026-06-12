import 'server-only'

import { Effect } from 'effect'
import {
    DeletePushSubscriptionError,
    GetPushSubscriptionError,
    SavePushSubscriptionError,
} from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import type { SupabaseClient } from '@supabase/supabase-js'

// Returns the raw Supabase response — callers branch on `error` with their own error code
export function selectPushSubscriptions(supabase: SupabaseClient, userId: string) {
    return Effect.tryPromise({
        try: () => supabase.from('push_subscriptions').select('subscription').eq('user_id', userId),
        catch: (cause) =>
            new GetPushSubscriptionError({ cause, error_hash: ErrorCode.PUSH_SEND_FETCH_SUB }),
    })
}

export const upsertPushSubscription = Effect.fn('upsertPushSubscription')(function* (
    supabase: SupabaseClient,
    userId: string,
    subscription: PushSubscriptionJSON
) {
    const { error } = yield* Effect.tryPromise({
        try: () =>
            supabase
                .from('push_subscriptions')
                .upsert({ user_id: userId, subscription }, { onConflict: 'user_id' }),
        catch: (cause) =>
            new SavePushSubscriptionError({ cause, error_hash: ErrorCode.PUSH_SUBSCRIBE_SAVE }),
    })

    if (error) {
        return yield* new SavePushSubscriptionError({
            cause: error,
            error_hash: ErrorCode.PUSH_SUBSCRIBE_SAVE_ERR,
        })
    }
})

export const deletePushSubscription = Effect.fn('deletePushSubscription')(function* (
    supabase: SupabaseClient,
    userId: string
) {
    const { error } = yield* Effect.tryPromise({
        try: () => supabase.from('push_subscriptions').delete().eq('user_id', userId),
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
})
