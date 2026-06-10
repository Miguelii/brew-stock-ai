import 'server-only'

import { Effect, Match } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError, GetCreditsError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import type { User } from '@supabase/supabase-js'
import { protectedProcedure } from '@/server/trpc'
import { runEffect } from '@/server/utils'

const getCredits = Effect.fn('getCredits')(function* (user: User) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.TOKENS_GET_SB_CLIENT }),
    })

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

export const GET_CREDITS_PROTECTED_PROCEDURE = protectedProcedure.query(({ ctx }) =>
    runEffect(getCredits(ctx.user), 'getCredits', (error) =>
        Match.value(error).pipe(
            Match.tag('CreateSbClientError', () => 'INTERNAL_SERVER_ERROR' as const),
            Match.tag('GetCreditsError', () => 'INTERNAL_SERVER_ERROR' as const),
            Match.exhaustive
        )
    )
)
