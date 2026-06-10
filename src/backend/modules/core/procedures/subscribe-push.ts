import 'server-only'

import { Effect, Match } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError, SavePushSubscriptionError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import type { User } from '@supabase/supabase-js'
import { protectedProcedure } from '@/server/trpc'
import { runEffect } from '@/server/utils'
import { z } from 'zod'

const subscribePush = Effect.fn('subscribePush')(function* (
    user: User,
    subscription: PushSubscriptionJSON
) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(true),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.PUSH_SUBSCRIBE_SB_CLIENT }),
    })

    const { error } = yield* Effect.tryPromise({
        try: () =>
            supabase
                .from('push_subscriptions')
                .upsert({ user_id: user.id, subscription }, { onConflict: 'user_id' }),
        catch: (cause) =>
            new SavePushSubscriptionError({ cause, error_hash: ErrorCode.PUSH_SUBSCRIBE_SAVE }),
    })

    if (error) {
        return yield* new SavePushSubscriptionError({
            cause: error,
            error_hash: ErrorCode.PUSH_SUBSCRIBE_SAVE_ERR,
        })
    }

    return { success: true }
})

export const SUBSCRIBE_PUSH_PROTECTED_PROCEDURE = protectedProcedure
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
