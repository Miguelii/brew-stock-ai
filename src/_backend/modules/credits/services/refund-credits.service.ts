import 'server-only'

import { Effect } from 'effect'
import { createSbAdminClient } from '@/lib/utils.server'
import { CreateSbClientError, RefundCreditsError } from '@/_backend/lib/errors'
import { ErrorCode } from '@/_backend/lib/error-codes'
import type { SupabaseClient } from '@supabase/supabase-js'

export const refundCredits = Effect.fn('refundCredits')(function* (
    userId: string,
    amount: number,
    client?: SupabaseClient
) {
    const supabase =
        client ??
        (yield* Effect.try({
            try: () => createSbAdminClient(),
            catch: (cause) =>
                new CreateSbClientError({ cause, error_hash: ErrorCode.TOKENS_REFUND_RPC_ERR }),
        }))

    const { data, error } = yield* Effect.tryPromise({
        try: () => supabase.rpc('add_credits', { p_user_id: userId, p_credits: amount }),
        catch: (cause) =>
            new RefundCreditsError({ cause, error_hash: ErrorCode.TOKENS_REFUND_RPC_ERR }),
    })

    if (error) {
        return yield* new RefundCreditsError({
            cause: error,
            error_hash: ErrorCode.TOKENS_REFUND_RPC_ERR,
        })
    }

    return data as number
})
