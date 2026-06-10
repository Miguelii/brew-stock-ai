import 'server-only'

import { Effect, Match } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError, SendOtpError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import { publicProcedure } from '@/server/trpc'
import { runEffect } from '@/server/utils'
import { z } from 'zod'

const sbSendOtp = Effect.fn('sbSendOtp')(function* (email: string) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.AUTH_OTP_SEND_SB_CLIENT }),
    })

    const { error } = yield* Effect.tryPromise({
        try: () => supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } }),
        catch: (cause) => new SendOtpError({ cause, error_hash: ErrorCode.AUTH_OTP_SEND_REQUEST }),
    })

    if (error)
        return yield* Effect.fail(
            new SendOtpError({ cause: error, error_hash: ErrorCode.AUTH_OTP_SEND_ERR })
        )

    return { status: 200 }
})

export const SB_SEND_OTP_PUBLIC_PROCEDURE = publicProcedure
    .input(z.object({ email: z.email() }))
    .mutation(({ input }) =>
        runEffect(sbSendOtp(input.email), 'sbSendOtp', (error) =>
            Match.value(error).pipe(
                Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('SendOtpError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.exhaustive
            )
        )
    )
