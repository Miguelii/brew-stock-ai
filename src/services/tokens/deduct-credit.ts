import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError, DeductCreditError, InsufficientCreditsError } from '@/services/errors'
import { ErrorCode } from '@/services/error-codes'
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
            catch: (cause) =>
                new CreateSbClientError({ cause, error_hash: ErrorCode.TOKENS_DEDUCT_SB_CLIENT }),
        }))

    const { data, error } = yield* Effect.tryPromise({
        try: () => supabase.rpc('deduct_credit', { p_user_id: userId, p_amount: amount }),
        catch: (cause) =>
            new DeductCreditError({ cause, error_hash: ErrorCode.TOKENS_DEDUCT_RPC_ERR }),
    })

    if (error) {
        return yield* new DeductCreditError({
            cause: error,
            error_hash: ErrorCode.TOKENS_DEDUCT_RPC_ERR,
        })
    }

    if (!data) {
        return yield* new InsufficientCreditsError({ error_hash: ErrorCode.TOKENS_INSUFFICIENT })
    }

    return data as number
})
