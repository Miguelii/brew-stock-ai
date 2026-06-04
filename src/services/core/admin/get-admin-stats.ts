import 'server-only'

import { Effect } from 'effect'
import { createSbAdminClient } from '@/lib/utils.server'
import { AdminStatsError, UnauthenticatedError } from '@/services/lib/errors'
import { ErrorCode } from '@/services/lib/error-codes'
import { isSuperAdmin } from '@/services/core/admin/is-super-admin'

export type AdminStats = {
    totalReports: number
    completedReports: number
    failedReports: number
    totalUsers: number
}

export const getAdminStats = Effect.fn('getAdminStats')(function* (callerEmail: string) {
    if (!isSuperAdmin(callerEmail)) {
        return yield* new UnauthenticatedError({ error_hash: ErrorCode.ADMIN_UNAUTH })
    }

    const supabase = createSbAdminClient()

    const [total, completed, failed, users] = yield* Effect.all(
        [
            Effect.tryPromise({
                try: () => supabase.from('reports').select('*', { count: 'exact', head: true }),
                catch: (cause) =>
                    new AdminStatsError({ cause, error_hash: ErrorCode.ADMIN_STATS_FETCH }),
            }),
            Effect.tryPromise({
                try: () =>
                    supabase
                        .from('reports')
                        .select('*', { count: 'exact', head: true })
                        .eq('status', 'COMPLETED'),
                catch: (cause) =>
                    new AdminStatsError({ cause, error_hash: ErrorCode.ADMIN_STATS_FETCH }),
            }),
            Effect.tryPromise({
                try: () =>
                    supabase
                        .from('reports')
                        .select('*', { count: 'exact', head: true })
                        .eq('status', 'FAILED'),
                catch: (cause) =>
                    new AdminStatsError({ cause, error_hash: ErrorCode.ADMIN_STATS_FETCH }),
            }),
            Effect.tryPromise({
                try: () => supabase.auth.admin.listUsers({ perPage: 1 }),
                catch: (cause) =>
                    new AdminStatsError({ cause, error_hash: ErrorCode.ADMIN_STATS_FETCH }),
            }),
        ],
        { concurrency: 'unbounded' }
    )

    return {
        totalReports: total.count ?? 0,
        completedReports: completed.count ?? 0,
        failedReports: failed.count ?? 0,
        totalUsers: 'total' in (users.data ?? {}) ? (users.data as { total: number }).total : 0,
    } satisfies AdminStats
})
