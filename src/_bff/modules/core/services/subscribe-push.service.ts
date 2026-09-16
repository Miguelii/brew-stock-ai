import 'server-only'

import { Effect } from 'effect'
import { createDBServerClient } from '@/_bff/core/db'
import { CreateSbClientError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import type { User } from '@supabase/supabase-js'
import { upsertPushSubscription } from '@/_bff/modules/core/repositories/push-subscriptions.repository'

export const subscribePush = Effect.fn('subscribePush')(function* (
    user: User,
    subscription: PushSubscriptionJSON
) {
    const supabase = yield* Effect.tryPromise({
        try: () => createDBServerClient(true),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.PUSH_SUBSCRIBE_SB_CLIENT }),
    })

    yield* upsertPushSubscription(supabase, user.id, subscription)

    return { success: true }
})
