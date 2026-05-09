import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import {
    CreateSbClientError,
    DeletePushSubscriptionError,
    UnauthenticatedError,
} from '@/services/errors'
import { getSession } from '@/services/auth/get-session'

export const unsubscribePush = Effect.fn('unsubscribePush')(function* () {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) => new CreateSbClientError({ cause, error_hash: 'eunsubpshsbclnt' }),
    })

    const user = yield* getSession(supabase)

    if (!user) {
        return yield* new UnauthenticatedError({ error_hash: 'eunsubpshunauthd' })
    }

    const { error } = yield* Effect.tryPromise({
        try: () => supabase.from('push_subscriptions').delete().eq('user_id', user.id),
        catch: (cause) => new DeletePushSubscriptionError({ cause, error_hash: 'eunsubpshdelete' }),
    })

    if (error) {
        return yield* new DeletePushSubscriptionError({ cause: error, error_hash: 'eunsubpsherr' })
    }

    return { success: true }
})
