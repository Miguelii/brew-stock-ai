import { ErrorCode } from '@/_bff/lib/error-codes'
import {
    SendPushNotificationError,
    CreateSbClientError,
    GetPushSubscriptionError,
} from '@/_bff/lib/errors'
import { createSbAdminClient } from '@/lib/utils.server'
import { Effect } from 'effect'
import { setupVapid } from '@/_bff/modules/core/helpers/setup-valid.helper'
import { sendToSubscriptions } from '@/_bff/modules/core/processors/send-to-subscriptions.processor'
import { selectPushSubscriptions } from '@/_bff/modules/core/repositories/push-subscriptions.repository'

/**
 * Send a push notification to a specific user by ID.
 * Uses the admin client — for Trigger.dev tasks (no cookie available).
 */
export const sendPushNotificationToUser = Effect.fn('sendPushNotificationToUser')(function* (
    userId: string,
    title: string,
    body: string
) {
    yield* Effect.try({
        try: () => setupVapid(),
        catch: (cause) =>
            new SendPushNotificationError({ cause, error_hash: ErrorCode.PUSH_VAPID_SETUP }),
    })

    const supabase = yield* Effect.try({
        try: () => createSbAdminClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.PUSH_SEND_TO_USER_SB_CLIENT }),
    })

    const { data: rows, error } = yield* selectPushSubscriptions(supabase, userId)

    if (error)
        return yield* new GetPushSubscriptionError({
            cause: error,
            error_hash: ErrorCode.PUSH_SEND_TO_USER_ERR,
        })
    if (!rows?.length) return { success: false, reason: 'no_subscription' as const }

    return yield* sendToSubscriptions(rows, title, body)
})
