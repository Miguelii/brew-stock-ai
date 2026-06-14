import { Effect } from 'effect'
import { AdminStatsError, GetAdminFeedbackError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { ReportStatus } from '@/types/ReportDTO'

export const countReports = Effect.fn('countReports')(function* (
    supabase: SupabaseClient,
    status?: ReportStatus
) {
    const { count } = yield* Effect.tryPromise({
        try: () => {
            const query = supabase.from('reports').select('*', { count: 'exact', head: true })
            return status ? query.eq('status', status) : query
        },
        catch: (cause) => new AdminStatsError({ cause, error_hash: ErrorCode.ADMIN_STATS_FETCH }),
    })

    return count ?? 0
})

export const countUsers = Effect.fn('countUsers')(function* (supabase: SupabaseClient) {
    const users = yield* Effect.tryPromise({
        try: () => supabase.auth.admin.listUsers({ perPage: 1 }),
        catch: (cause) => new AdminStatsError({ cause, error_hash: ErrorCode.ADMIN_STATS_FETCH }),
    })

    return 'total' in (users.data ?? {}) ? (users.data as { total: number }).total : 0
})

export const listUsers = Effect.fn('listUsers')(function* (supabase: SupabaseClient) {
    const result = yield* Effect.tryPromise({
        try: () => supabase.auth.admin.listUsers({ perPage: 1000, page: 1 }),
        catch: (cause) => new AdminStatsError({ cause, error_hash: ErrorCode.ADMIN_STATS_FETCH }),
    })

    return result.data.users
})

export const selectAdminReports = Effect.fn('selectAdminReports')(function* (
    supabase: SupabaseClient
) {
    const { data, error } = yield* Effect.tryPromise({
        try: () =>
            supabase
                .from('reports')
                .select('id, created_at, user_id, stock, type, status, ticker, cost')
                .order('created_at', { ascending: false })
                .limit(200),
        catch: (cause) => new AdminStatsError({ cause, error_hash: ErrorCode.ADMIN_STATS_FETCH }),
    })

    if (error) {
        return yield* new AdminStatsError({ cause: error, error_hash: ErrorCode.ADMIN_STATS_FETCH })
    }

    return data ?? []
})

export const selectAdminFeedback = Effect.fn('selectAdminFeedback')(function* (
    supabase: SupabaseClient
) {
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

    return data ?? []
})
