import 'server-only'

import { Effect } from 'effect'
import { createDBServerClient } from '@/_bff/core/db'
import { CreateSbClientError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import type { User } from '@supabase/supabase-js'
import { deletePushSubscription } from '@/_bff/modules/core/repositories/push-subscriptions.repository'

export const unsubscribePush = Effect.fn('unsubscribePush')(function* (user: User) {
    const supabase = yield* Effect.tryPromise({
        try: () => createDBServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.PUSH_UNSUBSCRIBE_SB_CLIENT }),
    })

    yield* deletePushSubscription(supabase, user.id)

    return { success: true }
})
