import 'server-only'

import { Effect, Match } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError, GetPushSubscriptionError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import type { User } from '@supabase/supabase-js'
import { protectedProcedure } from '@/_trpc/server'
import { runEffect } from '@/_trpc/utils'
import { z } from 'zod'
import { setupVapid } from '../helpers/setup-valid.helper'
import { fetchSubscriptions } from '../processors/fetch-subscriptions.processor'
import { sendToSubscriptions } from '../processors/send-to-subscriptions.processor'

/**
 * Send a push notification to the currently logged-in user.
 * Uses the cookie-based Supabase client — for tRPC procedures.
 */
const sendPushNotification = Effect.fn('sendPushNotification')(function* (
    user: User,
    title: string,
    body: string
) {
    setupVapid()

    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.PUSH_SEND_SB_CLIENT }),
    })

    const { data: rows, error } = yield* fetchSubscriptions(supabase, user.id)

    if (error)
        return yield* new GetPushSubscriptionError({
            cause: error,
            error_hash: ErrorCode.PUSH_SEND_USER_ERR,
        })
    if (!rows?.length) return { success: false, reason: 'no_subscription' as const }

    return yield* sendToSubscriptions(rows, title, body)
})

export const SEND_PUSH_NOTIFICATION_PROTECTED_PROCEDURE = protectedProcedure
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
