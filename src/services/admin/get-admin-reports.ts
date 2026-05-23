import 'server-only'

import { Effect } from 'effect'
import { createSbAdminClient } from '@/lib/utils.server'
import { AdminStatsError } from '@/services/errors'
import { ErrorCode } from '@/services/error-codes'
import type { ReportStatus } from '@/types/ReportDTO'
import type { PropmptsEnum } from '@/types/PropmptsEnum'

export type AdminReport = {
    id: string
    created_at: string
    user_id: string
    stock: string
    type: PropmptsEnum
    status: ReportStatus
    ticker: string
}

export const getAdminReports = Effect.fn('getAdminReports')(function* () {
    const supabase = createSbAdminClient()

    const { data, error } = yield* Effect.tryPromise({
        try: () =>
            supabase
                .from('reports')
                .select('id, created_at, user_id, stock, type, status, ticker')
                .order('created_at', { ascending: false })
                .limit(200),
        catch: (cause) => new AdminStatsError({ cause, error_hash: ErrorCode.ADMIN_STATS_FETCH }),
    })

    if (error) {
        return yield* new AdminStatsError({ cause: error, error_hash: ErrorCode.ADMIN_STATS_FETCH })
    }

    return (data ?? []) as AdminReport[]
})
