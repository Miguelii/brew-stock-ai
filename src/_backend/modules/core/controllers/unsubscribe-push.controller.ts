import { Match } from 'effect'
import { protectedProcedure } from '@/_trpc/server'
import { runEffect } from '@/_trpc/utils'
import { unsubscribePush } from '@/_backend/modules/core/services/unsubscribe-push.service'

export const UNSUBSCRIBE_PUSH_PROTECTED_CONTROLLER = protectedProcedure.mutation(({ ctx }) =>
    runEffect(unsubscribePush(ctx.user), 'unsubscribePush', (error) =>
        Match.value(error).pipe(
            Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
            Match.tag('DeletePushSubscriptionError', () => 'INTERNAL_SERVER_ERROR' as const),
            Match.exhaustive
        )
    )
)
