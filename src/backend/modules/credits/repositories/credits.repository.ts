import { Effect } from 'effect'
import { GetCreditsError, GetInvoicesError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import type { SupabaseClient } from '@supabase/supabase-js'

export const selectCredits = Effect.fn('selectCredits')(function* (
    supabase: SupabaseClient,
    userId: string
) {
    const { data, error } = yield* Effect.tryPromise({
        try: () =>
            supabase.from('user_credits').select('credits').eq('user_id', userId).maybeSingle(),
        catch: (cause) => new GetCreditsError({ cause, error_hash: ErrorCode.TOKENS_GET_FETCH }),
    })

    if (error) {
        return yield* new GetCreditsError({ cause: error, error_hash: ErrorCode.TOKENS_GET_FETCH })
    }

    return (data?.credits ?? 0) as number
})

export const selectStripeCustomerId = Effect.fn('selectStripeCustomerId')(function* (
    supabase: SupabaseClient,
    userId: string
) {
    const { data } = yield* Effect.tryPromise({
        try: () =>
            supabase
                .from('user_credits')
                .select('stripe_customer_id')
                .eq('user_id', userId)
                .single(),
        catch: (cause) =>
            new GetInvoicesError({ cause, error_hash: ErrorCode.INVOICES_CREDITS_FETCH }),
    })

    return (data?.stripe_customer_id ?? null) as string | null
})
