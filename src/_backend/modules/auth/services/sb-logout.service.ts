import 'server-only'

import { createSbServerClient } from '@/lib/utils.server'
import { Effect } from 'effect'
import { CreateSbClientError, LogoutError } from '@/_backend/lib/errors'
import { ErrorCode } from '@/_backend/lib/error-codes'
import { revalidatePath } from 'next/cache'
import { HOME_PAGE_PATH } from '@/lib/constants'

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

    revalidatePath(HOME_PAGE_PATH, 'layout')

    return { status: 200 }
})
