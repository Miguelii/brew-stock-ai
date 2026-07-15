import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError, GetPushSubscriptionError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import type { User } from '@supabase/supabase-js'
import { setupVapid } from '@/_bff/modules/core/helpers/setup-valid.helper'
import { selectPushSubscriptions } from '@/_bff/modules/core/repositories/push-subscriptions.repository'
import { sendToSubscriptions } from '@/_bff/modules/core/processors/send-to-subscriptions.processor'

/**
 * Send a push notification to the currently logged-in user.
 * Uses the cookie-based Supabase client — for tRPC controllers.
 */
export const sendPushNotification = Effect.fn('sendPushNotification')(function* (
    user: User,
    title: string,
    body: string
) {
    setupVapid()

    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.PUSH_SEND_SB_CLIENT }),
    })

    const { data: rows, error } = yield* selectPushSubscriptions(supabase, user.id)

    if (error)
        return yield* new GetPushSubscriptionError({
            cause: error,
            error_hash: ErrorCode.PUSH_SEND_USER_ERR,
        })
    if (!rows?.length) return { success: false, reason: 'no_subscription' as const }

    return yield* sendToSubscriptions(rows, title, body)
})
