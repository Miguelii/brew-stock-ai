import { Effect } from 'effect'
import webpush from 'web-push'
import { z } from 'zod'
import { SendPushNotificationError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import { PUSH_SUBSCRIPTION_SCHEMA } from '@/_bff/core/constants/push-subscription.constants'

// Rows are typed as the DOM PushSubscriptionJSON, whose fields are all optional
const WebPushSubscriptionSchema = PUSH_SUBSCRIPTION_SCHEMA.pick({
    endpoint: true,
    keys: true,
}) satisfies z.ZodType<webpush.PushSubscription>

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
                        WebPushSubscriptionSchema.parse(row.subscription),
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
