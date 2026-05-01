import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import {
    CreateSbClientError,
    DeductCreditError,
    InsufficientCreditsError,
} from '@/services/utils/tagged-errors'
import type { SupabaseClient } from '@supabase/supabase-js'

export const deductCredit = Effect.fn('deductCredit')(function* (
    userId: string,
    client?: SupabaseClient,
    amount = 1
) {
    const supabase =
        client ??
        (yield* Effect.tryPromise({
            try: () => createSbServerClient(),
            catch: (cause) => new CreateSbClientError({ cause, error_hash: 'edctcrdtsbclnt' }),
        }))

    const { data, error } = yield* Effect.tryPromise({
        try: () => supabase.rpc('deduct_credit', { p_user_id: userId, p_amount: amount }),
        catch: (cause) => new DeductCreditError({ cause, error_hash: 'edctcrdtrpcerr' }),
    })

    if (error) {
        return yield* new DeductCreditError({ cause: error, error_hash: 'edctcrdtrpcerr' })
    }

    if (!data) {
        return yield* new InsufficientCreditsError({ error_hash: 'edctcrdtinsuff' })
    }

    return data as number
})
