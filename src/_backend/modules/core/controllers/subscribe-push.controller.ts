import { Match } from 'effect'
import { protectedProcedure } from '@/_trpc/server'
import { runEffect } from '@/_trpc/utils'
import { z } from 'zod'
import { subscribePush } from '@/_backend/modules/core/services/subscribe-push.service'

export const SUBSCRIBE_PUSH_PROTECTED_CONTROLLER = protectedProcedure
    .input(
        z.object({
            subscription: z.object({
                endpoint: z.string(),
                expirationTime: z.number().nullable(),
                keys: z.object({ p256dh: z.string(), auth: z.string() }),
            }),
        })
    )
    .mutation(({ input, ctx }) =>
        runEffect(subscribePush(ctx.user, input.subscription), 'subscribePush', (error) =>
            Match.value(error).pipe(
                Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('SavePushSubscriptionError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.exhaustive
            )
        )
    )
