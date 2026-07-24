import 'server-only'

import { createSbServerClient } from '@/lib/utils.server'
import { Effect } from 'effect'
import { CreateSbClientError, LogoutError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import { revalidatePath } from 'next/cache'

export const sbLogout = Effect.fn('sbLogout')(function* () {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.AUTH_LOGOUT_SB_CLIENT }),
    })

    const { error } = yield* Effect.tryPromise({
        try: () => supabase.auth.signOut(),
        catch: (cause) => new LogoutError({ cause, error_hash: ErrorCode.AUTH_LOGOUT_SIGN_OUT }),
    })

    if (error)
        return yield* new LogoutError({
            cause: error,
            error_hash: ErrorCode.AUTH_LOGOUT_SIGN_OUT_ERR,
        })

    revalidatePath('/', 'layout')

    return { status: 200 }
})
