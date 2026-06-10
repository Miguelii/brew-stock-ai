import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import {
    CreateSbClientError,
    DeductCreditError,
    InsufficientCreditsError,
} from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
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

    // Insufficient credits — SQL returns NULL when balance < cost (no row updated)
    if (data === null || data === undefined || data < 0) {
        return yield* new InsufficientCreditsError({ error_hash: ErrorCode.TOKENS_INSUFFICIENT })
    }

    return data as number
})
