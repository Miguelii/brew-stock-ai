import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import type { User } from '@supabase/supabase-js'
import { deletePushSubscription } from '@/backend/modules/core/repositories/push-subscriptions.repository'

export const unsubscribePush = Effect.fn('unsubscribePush')(function* (user: User) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.PUSH_UNSUBSCRIBE_SB_CLIENT }),
    })

    yield* deletePushSubscription(supabase, user.id)

    return { success: true }
})
