import 'server-only'

import { Effect, Match } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError, VerifyOtpError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import { Logger } from '@/lib/logger'
import { SB_OTP_TOKEN_LENGTH } from '@/lib/constants'
import { publicProcedure } from '@/server/trpc'
import { runEffect } from '@/server/utils'
import { z } from 'zod'

const sbVerifyOtp = Effect.fn('sbVerifyOtp')(function* (email: string, token: string) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.AUTH_OTP_VERIFY_SB_CLIENT }),
    })

    const { error } = yield* Effect.tryPromise({
        try: () => supabase.auth.verifyOtp({ email, token, type: 'email' }),
        catch: (cause) =>
            new VerifyOtpError({ cause, error_hash: ErrorCode.AUTH_OTP_VERIFY_REQUEST }),
    })

    if (error) {
        Logger({ level: 'error', prefix: 'sbVerifyOtp', error })

        return yield* Effect.fail(
            new VerifyOtpError({ cause: error, error_hash: ErrorCode.AUTH_OTP_VERIFY_ERR })
        )
    }

    return { status: 200 }
})

export const SB_VERIFY_OTP_PUBLIC_PROCEDURE = publicProcedure
    .input(z.object({ email: z.email(), token: z.string().length(SB_OTP_TOKEN_LENGTH) }))
    .mutation(({ input }) =>
        runEffect(sbVerifyOtp(input.email, input.token), 'sbVerifyOtp', (error) =>
            Match.value(error).pipe(
                Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('VerifyOtpError', () => 'UNAUTHORIZED' as const),
                Match.exhaustive
            )
        )
    )
