import { Match } from 'effect'
import { protectedProcedure } from '@/_trpc/server'
import { runEffect } from '@/_trpc/utils'
import { z } from 'zod'
import { sendPushNotification } from '@/_backend/modules/core/services/send-push-notification.service'

export const SEND_PUSH_NOTIFICATION_PROTECTED_CONTROLLER = protectedProcedure
    .input(z.object({ title: z.string().min(1), body: z.string().min(1) }))
    .mutation(({ input, ctx }) =>
        runEffect(
            sendPushNotification(ctx.user, input.title, input.body),
            'sendPushNotification',
            (error) =>
                Match.value(error).pipe(
                    Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.tag('GetPushSubscriptionError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.tag('SendPushNotificationError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.exhaustive
                )
        )
    )
