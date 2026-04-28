import 'server-only'

import { Effect } from 'effect'
import webpush from 'web-push'
import { createSbAdminClient } from '@/lib/utils.server'
import { ServerEnv } from '@/env/server'
import { GetPushSubscriptionError, SendPushNotificationError } from '@/services/utils/constants'
import { ClientEnv } from '@/env/client'
import type { SupabaseClient } from '@supabase/supabase-js'

function setupVapid() {
    webpush.setVapidDetails(
        `mailto:${ServerEnv.VAPID_EMAIL}`,
        ClientEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        ServerEnv.VAPID_PRIVATE_KEY
    )
}

function sendToSubscriptions(
    rows: { subscription: unknown }[],
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
        catch: (cause) => new SendPushNotificationError({ cause, error_hash: 'esndpshsend' }),
    }).pipe(Effect.map(() => ({ success: true as const })))
}

function fetchSubscriptions(supabase: SupabaseClient, userId: string) {
    return Effect.tryPromise({
        try: () => supabase.from('push_subscriptions').select('subscription').eq('user_id', userId),
        catch: (cause) => new GetPushSubscriptionError({ cause, error_hash: 'esndpshfetch' }),
    })
}

export const sendPushNotificationToUser = Effect.fn('sendPushNotificationToUser')(function* (
    userId: string,
    title: string,
    body: string
) {
    setupVapid()

    // Called from Trigger.dev tasks — so uses admin client (no cookie needed)
    const supabase = createSbAdminClient()

    const { data: rows, error } = yield* fetchSubscriptions(supabase, userId)

    if (error)
        return yield* new GetPushSubscriptionError({ cause: error, error_hash: 'esndpshusrerr' })
    if (!rows?.length) return { success: false, reason: 'no_subscription' as const }

    return yield* sendToSubscriptions(rows, title, body)
})
