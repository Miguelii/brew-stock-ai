import 'server-only'

import { Effect } from 'effect'
import { createSbAdminClient } from '@/lib/utils.server'
import { GetAdminFeedbackError, UnauthenticatedError } from '@/services/lib/errors'
import { ErrorCode } from '@/services/lib/error-codes'
import { isSuperAdmin } from '@/services/core/admin/is-super-admin'

export type AdminFeedback = {
    id: string
    created_at: string
    name: string
    email: string
    message: string
    user_id: string | null
}

export const getAdminFeedback = Effect.fn('getAdminFeedback')(function* (callerEmail: string) {
    if (!isSuperAdmin(callerEmail)) {
        return yield* new UnauthenticatedError({ error_hash: ErrorCode.ADMIN_UNAUTH })
    }

    const supabase = createSbAdminClient()

    const { data, error } = yield* Effect.tryPromise({
        try: () =>
            supabase
                .from('feedback')
                .select('id, created_at, name, email, message, user_id')
                .order('created_at', { ascending: false })
                .limit(200),
        catch: (cause) =>
            new GetAdminFeedbackError({ cause, error_hash: ErrorCode.ADMIN_FEEDBACK_FETCH }),
    })

    if (error) {
        return yield* new GetAdminFeedbackError({
            cause: error,
            error_hash: ErrorCode.ADMIN_FEEDBACK_FETCH_ERR,
        })
    }

    return (data ?? []) as AdminFeedback[]
})
