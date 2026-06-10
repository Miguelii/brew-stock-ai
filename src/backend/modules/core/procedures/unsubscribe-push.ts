import 'server-only'

import { Effect, Match } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError, DeletePushSubscriptionError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import type { User } from '@supabase/supabase-js'
import { protectedProcedure } from '@/server/trpc'
import { runEffect } from '@/server/utils'

const unsubscribePush = Effect.fn('unsubscribePush')(function* (user: User) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.PUSH_UNSUBSCRIBE_SB_CLIENT }),
    })

    const { error } = yield* Effect.tryPromise({
        try: () => supabase.from('push_subscriptions').delete().eq('user_id', user.id),
        catch: (cause) =>
            new DeletePushSubscriptionError({
                cause,
                error_hash: ErrorCode.PUSH_UNSUBSCRIBE_DELETE,
            }),
    })

    if (error) {
        return yield* new DeletePushSubscriptionError({
            cause: error,
            error_hash: ErrorCode.PUSH_UNSUBSCRIBE_DELETE_ERR,
        })
    }

    return { success: true }
})

export const UNSUBSCRIBE_PUSH_PROTECTED_PROCEDURE = protectedProcedure.mutation(({ ctx }) =>
    runEffect(unsubscribePush(ctx.user), 'unsubscribePush', (error) =>
        Match.value(error).pipe(
            Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
            Match.tag('DeletePushSubscriptionError', () => 'INTERNAL_SERVER_ERROR' as const),
            Match.exhaustive
        )
    )
)
