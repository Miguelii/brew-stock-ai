import 'server-only'

import { createSbServerClient } from '@/lib/utils.server'
import { Effect } from 'effect'
import { CreateSbClientError, SignUpError } from '@/services/utils/constants'
import { sbLogin } from './sb-login'

export const sbSignUp = Effect.fn('sbSignUp')(function* (email: string, password: string) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(true),
        catch: (cause) => new CreateSbClientError({ cause, error_hash: 'esgnspclient' }),
    })

    const { error } = yield* Effect.tryPromise({
        try: () =>
            supabase.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
            }),
        catch: (cause) => new SignUpError({ cause, error_hash: 'esgnspauth' }),
    })

    if (error) return yield* new SignUpError({ cause: error, error_hash: 'esgnspautherr' })

    yield* Effect.orElse(sbLogin(email, password), () => Effect.void)

    return { status: 200 }
})
