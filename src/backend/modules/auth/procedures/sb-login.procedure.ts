import 'server-only'

import { createSbServerClient } from '@/lib/utils.server'
import { Effect, Match } from 'effect'
import { CreateSbClientError, SignInWithPasswordError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import { z } from 'zod'
import { publicProcedure } from '@/server/trpc'
import { runEffect } from '@/server/utils'

const sbLogin = Effect.fn('sbLogin')(function* (email: string, password: string) {
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

export const SB_LOGIN_PUBLIC_PROCEDURE = publicProcedure
    .input(z.object({ email: z.email(), password: z.string() }))
    .mutation(({ input }) =>
        runEffect(sbLogin(input.email, input.password), 'sbLogin', (error) =>
            Match.value(error).pipe(
                Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
                Match.tag('SignInWithPasswordError', () => 'UNAUTHORIZED' as const),
                Match.exhaustive
            )
        )
    )
