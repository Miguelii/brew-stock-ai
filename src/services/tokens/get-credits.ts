import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError, GetCreditsError, UnauthenticatedError } from '@/services/errors'
import { ErrorCode } from '@/services/error-codes'
import { getSession } from '@/services/auth/get-session'

export const getCredits = Effect.fn('getCredits')(function* () {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.TOKENS_GET_SB_CLIENT }),
    })

    const user = yield* getSession(supabase)

    if (!user) {
        return yield* new UnauthenticatedError({ error_hash: ErrorCode.TOKENS_GET_UNAUTH })
    }

    const { data, error } = yield* Effect.tryPromise({
        try: () =>
            supabase.from('user_credits').select('credits').eq('user_id', user.id).maybeSingle(),
        catch: (cause) => new GetCreditsError({ cause, error_hash: ErrorCode.TOKENS_GET_FETCH }),
    })

    if (error) {
        return yield* new GetCreditsError({ cause: error, error_hash: ErrorCode.TOKENS_GET_FETCH })
    }

    return data?.credits ?? 0
})
