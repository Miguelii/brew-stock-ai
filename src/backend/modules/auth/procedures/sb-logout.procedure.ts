import 'server-only'

import { createSbServerClient } from '@/lib/utils.server'
import { Effect, Match } from 'effect'
import { CreateSbClientError, LogoutError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import { revalidatePath } from 'next/cache'
import { HOME_PAGE_PATH } from '@/lib/constants'
import { runEffect } from '@/server/utils'
import { publicProcedure } from '@/server/trpc'

const sbLogout = Effect.fn('sbLogout')(function* () {
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

export const SB_LOGOUT_PUBLIC_PROCEDURE = publicProcedure.mutation(() =>
    runEffect(sbLogout(), 'sbLogout', (error) =>
        Match.value(error).pipe(
            Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
            Match.tag('LogoutError', () => 'INTERNAL_SERVER_ERROR' as const),
            Match.exhaustive
        )
    )
)
