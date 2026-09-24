import 'server-only'

import { Effect } from 'effect'
import { createDBServerClient } from '@/_bff/core/db'
import { CreateSbClientError, VerifyOtpError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import { Logger } from '@/_bff/lib/server-logger'
import { isNewUser } from '@/_bff/modules/auth/helpers/is-new-user.helper'

export const sbVerifyOtp = Effect.fn('sbVerifyOtp')(function* (email: string, token: string) {
    const supabase = yield* Effect.tryPromise({
        try: () => createDBServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.AUTH_OTP_VERIFY_SB_CLIENT }),
    })

    const { data, error } = yield* Effect.tryPromise({
        try: () => supabase.auth.verifyOtp({ email, token, type: 'email' }),
        catch: (cause) =>
            new VerifyOtpError({ cause, error_hash: ErrorCode.AUTH_OTP_VERIFY_REQUEST }),
    })

    if (error) {
        Logger({
            level: 'error',
            prefix: 'sbVerifyOtp',
            error,
            metadata: {
                email: email,
                inputToken: token,
            },
        })

        return yield* Effect.fail(
            new VerifyOtpError({ cause: error, error_hash: ErrorCode.AUTH_OTP_VERIFY_ERR })
        )
    }

    return { status: 200, isNewUser: isNewUser(data?.user) }
})
