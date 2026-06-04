import 'server-only'

import { Effect } from 'effect'
import webpush from 'web-push'
import { createSbAdminClient, createSbServerClient } from '@/lib/utils.server'
import { ServerEnv } from '@/env/server'
import {
    CreateSbClientError,
    GetPushSubscriptionError,
    SendPushNotificationError,
    UnauthenticatedError,
} from '@/services/lib/errors'
import { ErrorCode } from '@/services/lib/error-codes'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ClientEnv } from '@/env/client'
import { getSession } from '@/services/core/auth/get-session'

function setupVapid() {
    webpush.setVapidDetails(
        'mailto:miguelgoncalves18@hotmail.com',
        ClientEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        ServerEnv.VAPID_PRIVATE_KEY
    )
}

function fetchSubscriptions(supabase: SupabaseClient, userId: string) {
    return Effect.tryPromise({
        try: () => supabase.from('push_subscriptions').select('subscription').eq('user_id', userId),
        catch: (cause) =>
            new GetPushSubscriptionError({ cause, error_hash: ErrorCode.PUSH_SEND_FETCH_SUB }),
    })
}

function sendToSubscriptions(
    rows: { subscription: PushSubscriptionJSON }[],
    title: string,
    body: string
): Effect.Effect<{ success: true }, SendPushNotificationError> {
    return Effect.tryPromise({
        try: () =>
            Promise.all(
                rows.map((row) =>
                    webpush.sendNotification(
                        row.subscription as webpush.PushSubscription,
                        JSON.stringify({ title, body, icon: '/web-app-manifest-192x192.png' })
                    )
                )
            ),
        catch: (cause) => {
            return new SendPushNotificationError({
                cause,
                error_hash: ErrorCode.PUSH_SEND_DISPATCH,
            })
        },
    }).pipe(Effect.map(() => ({ success: true as const })))
}

/**
 * Send a push notification to the currently logged-in user.
 * Uses the cookie-based Supabase client — for tRPC procedures.
 */
export const sendPushNotification = Effect.fn('sendPushNotification')(function* (
    title: string,
    body: string
) {
    setupVapid()

    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.PUSH_SEND_SB_CLIENT }),
    })

    const user = yield* getSession(supabase)

    if (!user) {
        return yield* new UnauthenticatedError({ error_hash: ErrorCode.PUSH_SEND_UNAUTH })
    }

    const { data: rows, error } = yield* fetchSubscriptions(supabase, user.id)

    if (error)
        return yield* new GetPushSubscriptionError({
            cause: error,
            error_hash: ErrorCode.PUSH_SEND_USER_ERR,
        })
    if (!rows?.length) return { success: false, reason: 'no_subscription' as const }

    return yield* sendToSubscriptions(rows, title, body)
})

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

    const { data: rows, error } = yield* fetchSubscriptions(supabase, userId)

    if (error)
        return yield* new GetPushSubscriptionError({
            cause: error,
            error_hash: ErrorCode.PUSH_SEND_TO_USER_ERR,
        })
    if (!rows?.length) return { success: false, reason: 'no_subscription' as const }

    return yield* sendToSubscriptions(rows, title, body)
})
