import 'server-only'

import { Effect } from 'effect'
import webpush from 'web-push'
import { ServerEnv } from '@/env/server'
import { GetPushSubscriptionError, SendPushNotificationError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ClientEnv } from '@/env/client'

export function setupVapid() {
    webpush.setVapidDetails(
        'mailto:miguelgoncalves18@hotmail.com',
        ClientEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        ServerEnv.VAPID_PRIVATE_KEY
    )
}

export function fetchSubscriptions(supabase: SupabaseClient, userId: string) {
    return Effect.tryPromise({
        try: () => supabase.from('push_subscriptions').select('subscription').eq('user_id', userId),
        catch: (cause) =>
            new GetPushSubscriptionError({ cause, error_hash: ErrorCode.PUSH_SEND_FETCH_SUB }),
    })
}

export function sendToSubscriptions(
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
