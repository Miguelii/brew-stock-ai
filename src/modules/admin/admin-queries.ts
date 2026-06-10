import 'server-only'

import { cache } from 'react'
import { Effect } from 'effect'
import { getAdminStats, type AdminStats } from '@/backend/modules/admin/get-admin-stats'
import { getAdminUsers, type AdminUser } from '@/backend/modules/admin/get-admin-users'
import { getAdminReports, type AdminReport } from '@/backend/modules/admin/get-admin-reports'
import { getAdminFeedback, type AdminFeedback } from '@/backend/modules/admin/get-admin-feedback'

const EMPTY_STATS: AdminStats = {
    totalReports: 0,
    completedReports: 0,
    failedReports: 0,
    totalUsers: 0,
}

export const fetchAdminStats = cache((email: string) =>
    Effect.runPromise(getAdminStats(email).pipe(Effect.catchAll(() => Effect.succeed(EMPTY_STATS))))
)

export const fetchAdminUsers = cache((email: string) =>
    Effect.runPromise(
        getAdminUsers(email).pipe(Effect.catchAll(() => Effect.succeed([] as AdminUser[])))
    )
)

export const fetchAdminReports = cache((email: string) =>
    Effect.runPromise(
        getAdminReports(email).pipe(Effect.catchAll(() => Effect.succeed([] as AdminReport[])))
    )
)

export const fetchAdminFeedback = cache((email: string) =>
    Effect.runPromise(
        getAdminFeedback(email).pipe(Effect.catchAll(() => Effect.succeed([] as AdminFeedback[])))
    )
)
