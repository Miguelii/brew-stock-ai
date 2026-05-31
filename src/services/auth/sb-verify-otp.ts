import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError, VerifyOtpError } from '@/services/errors'
import { ErrorCode } from '@/services/error-codes'
import { Logger } from '@/lib/logger'

export const sbVerifyOtp = Effect.fn('sbVerifyOtp')(function* (email: string, token: string) {
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
