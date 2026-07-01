import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError, SendOtpError } from '@/_backend/lib/errors'
import { ErrorCode } from '@/_backend/lib/error-codes'

export const sbSendOtp = Effect.fn('sbSendOtp')(function* (email: string) {
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
