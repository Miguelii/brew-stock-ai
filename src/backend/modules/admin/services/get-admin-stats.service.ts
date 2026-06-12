import 'server-only'

import { Effect } from 'effect'
import { createSbAdminClient } from '@/lib/utils.server'
import { UnauthenticatedError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import { isSuperAdmin } from '@/backend/modules/admin/helpers/is-super-admin.helper'
import { countReports, countUsers } from '@/backend/modules/admin/repositories/admin.repository'
import { ReportStatus } from '@/types/ReportDTO'

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

    const [totalReports, completedReports, failedReports, totalUsers] = yield* Effect.all(
        [
            countReports(supabase),
            countReports(supabase, ReportStatus.COMPLETED),
            countReports(supabase, ReportStatus.FAILED),
            countUsers(supabase),
        ],
        { concurrency: 'unbounded' }
    )

    return {
        totalReports,
        completedReports,
        failedReports,
        totalUsers,
    } satisfies AdminStats
})
