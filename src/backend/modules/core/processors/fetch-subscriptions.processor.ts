import { Effect } from 'effect'
import { GetPushSubscriptionError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import type { SupabaseClient } from '@supabase/supabase-js'

export function fetchSubscriptions(supabase: SupabaseClient, userId: string) {
    return Effect.tryPromise({
        try: () => supabase.from('push_subscriptions').select('subscription').eq('user_id', userId),
        catch: (cause) =>
            new GetPushSubscriptionError({ cause, error_hash: ErrorCode.PUSH_SEND_FETCH_SUB }),
    })
}
