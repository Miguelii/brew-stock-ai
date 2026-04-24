import 'server-only'

import { createSbServerClient } from '@/lib/utils.server'
import { Effect } from 'effect'
import { CreateSbClientError, SignInWithPasswordError } from '@/services/utils/constants'

export const sbLogin = Effect.fn('sbLogin')(function* (email: string, password: string) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) => new CreateSbClientError({ cause, error_hash: 'lga12sd1231sdsda' }),
    })

    const { error } = yield* Effect.tryPromise({
        try: () =>
            supabase.auth.signInWithPassword({
                email: email,
                password: password,
            }),
        catch: (cause) => new SignInWithPasswordError({ cause, error_hash: 'signpasrasda' }),
    })

    if (error)
        return yield* Effect.fail(
            new SignInWithPasswordError({ cause: error, error_hash: 'signpasrasdaa123' })
        )

    return { status: 200 }
})
