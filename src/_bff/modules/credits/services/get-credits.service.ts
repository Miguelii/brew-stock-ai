import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import type { User } from '@supabase/supabase-js'
import { selectCredits } from '@/_bff/modules/credits/repositories/credits.repository'

export const getCredits = Effect.fn('getCredits')(function* (user: User) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.TOKENS_GET_SB_CLIENT }),
    })

    return yield* selectCredits(supabase, user.id)
})
