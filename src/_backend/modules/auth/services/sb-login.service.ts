import 'server-only'

import { createSbServerClient } from '@/lib/utils.server'
import { Effect } from 'effect'
import { CreateSbClientError, SignInWithPasswordError } from '@/_backend/lib/errors'
import { ErrorCode } from '@/_backend/lib/error-codes'

export const sbLogin = Effect.fn('sbLogin')(function* (email: string, password: string) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.AUTH_LOGIN_SB_CLIENT }),
    })

    const { error } = yield* Effect.tryPromise({
        try: () =>
            supabase.auth.signInWithPassword({
                email: email,
                password: password,
            }),
        catch: (cause) =>
            new SignInWithPasswordError({ cause, error_hash: ErrorCode.AUTH_LOGIN_SIGN_IN }),
    })

    if (error)
        return yield* Effect.fail(
            new SignInWithPasswordError({
                cause: error,
                error_hash: ErrorCode.AUTH_LOGIN_SIGN_IN_ERR,
            })
        )

    return { status: 200 }
})
