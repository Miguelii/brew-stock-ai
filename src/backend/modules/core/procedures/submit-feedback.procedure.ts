import 'server-only'

import { Effect, Match } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError, SubmitFeedbackError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import { getSession } from '@/backend/modules/auth/get-session'
import {
    CONTACT_FORM_MAX_NAME_LENGTH,
    CONTACT_FORM_MIN_MESSAGE_LENGTH,
    CONTACT_FORM_MAX_MESSAGE_LENGTH,
} from '@/lib/constants'
import { publicProcedure } from '@/_trpc/server'
import { runEffect } from '@/_trpc/utils'
import { z } from 'zod'

const submitFeedback = Effect.fn('submitFeedback')(function* (
    name: string,
    email: string,
    message: string
) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.FEEDBACK_SUBMIT_SB_CLIENT }),
    })

    const user = yield* getSession(supabase).pipe(Effect.catchAll(() => Effect.succeed(null)))

    const { error } = yield* Effect.tryPromise({
        try: () =>
            supabase.from('feedback').insert({
                name,
                email,
                message,
                created_at: 'now()',
                ...(user ? { user_id: user.id } : {}),
            }),
        catch: (cause) =>
            new SubmitFeedbackError({ cause, error_hash: ErrorCode.FEEDBACK_SUBMIT_INSERT }),
    })

    if (error) {
        return yield* new SubmitFeedbackError({
            cause: error,
            error_hash: ErrorCode.FEEDBACK_SUBMIT_INSERT_ERR,
        })
    }
})

export const SUBMIT_FEEDBACK_PUBLIC_PROCEDURE = publicProcedure
    .input(
        z.object({
            name: z.string().min(1).max(CONTACT_FORM_MAX_NAME_LENGTH),
            email: z.email(),
            message: z
                .string()
                .min(CONTACT_FORM_MIN_MESSAGE_LENGTH)
                .max(CONTACT_FORM_MAX_MESSAGE_LENGTH),
        })
    )
    .mutation(({ input }) =>
        runEffect(
            submitFeedback(input.name, input.email, input.message),
            'submitFeedback',
            (error) =>
                Match.value(error).pipe(
                    Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.tag('SubmitFeedbackError', () => 'INTERNAL_SERVER_ERROR' as const),
                    Match.exhaustive
                )
        )
    )
