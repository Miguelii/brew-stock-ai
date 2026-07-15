import { Effect } from 'effect'
import webpush from 'web-push'
import { SendPushNotificationError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'

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
