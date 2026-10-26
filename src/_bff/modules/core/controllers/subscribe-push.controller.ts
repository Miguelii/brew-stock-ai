import { Match } from 'effect'
import { protectedProcedure } from '@/_bff/trpc/server'
import { runEffect } from '@/_bff/trpc/utils'
import { z } from 'zod'
import { subscribePush } from '@/_bff/modules/core/services/subscribe-push.service'
import { PUSH_SUBSCRIPTION_SCHEMA } from '@/_bff/core/constants/push-subscription.constants'

export const SUBSCRIBE_PUSH_PROTECTED_CONTROLLER = protectedProcedure
    .input(
        z.object({
            subscription: PUSH_SUBSCRIPTION_SCHEMA,
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
