import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError, GetUserError } from '@/services/utils/tagged-errors'
import type { SupabaseClient } from '@supabase/supabase-js'

export const getSession = Effect.fn('getSession')(function* (client?: SupabaseClient) {
    const supabase =
        client ??
        (yield* Effect.tryPromise({
            try: () => createSbServerClient(),
            catch: (cause) => new CreateSbClientError({ cause, error_hash: 'ecrtrptsbclnt' }),
        }))

    const { data, error: userError } = yield* Effect.tryPromise({
        try: () => supabase.auth.getUser(),
        catch: (cause) => new GetUserError({ cause, error_hash: 'ecrtrptgtusrr' }),
    })

    const user = userError ? null : (data?.user ?? null)

    return user
})
