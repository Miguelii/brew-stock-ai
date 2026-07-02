import 'server-only'

import { Effect } from 'effect'
import { createSbAdminClient } from '@/lib/utils.server'
import { UnauthenticatedError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import { isAdmin } from '@/_bff/modules/admin/services/is-admin.service'
import { countReports, countUsers } from '@/_bff/modules/admin/repositories/admin.repository'
import { ReportStatus } from '@/types/ReportDTO'

export type AdminStats = {
    totalReports: number
    completedReports: number
    failedReports: number
    totalUsers: number
}

export const getAdminStats = Effect.fn('getAdminStats')(function* () {
    if (!(yield* isAdmin())) {
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
