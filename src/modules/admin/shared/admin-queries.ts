import { cache } from 'react'
import { Effect } from 'effect'
import {
    getAdminStats,
    type AdminStats,
} from '@/_backend/modules/admin/services/get-admin-stats.service'
import {
    getAdminUsers,
    type AdminUser,
} from '@/_backend/modules/admin/services/get-admin-users.service'
import {
    getAdminReports,
    type AdminReport,
} from '@/_backend/modules/admin/services/get-admin-reports.service'
import {
    getAdminFeedback,
    type AdminFeedback,
} from '@/_backend/modules/admin/services/get-admin-feedback.service'
import {
    getAdminLogs,
    type AdminLog,
} from '@/_backend/modules/admin/services/get-admin-logs.service'
import { isAdmin } from '@/_backend/modules/admin/services/is-admin.service'

const EMPTY_STATS: AdminStats = {
    totalReports: 0,
    completedReports: 0,
    failedReports: 0,
    totalUsers: 0,
}

export const fetchIsAdmin = cache(() =>
    Effect.runPromise(isAdmin().pipe(Effect.catchAll(() => Effect.succeed(false))))
)

export const fetchAdminStats = cache(() =>
    Effect.runPromise(getAdminStats().pipe(Effect.catchAll(() => Effect.succeed(EMPTY_STATS))))
)

export const fetchAdminUsers = cache(() =>
    Effect.runPromise(
        getAdminUsers().pipe(Effect.catchAll(() => Effect.succeed([] as AdminUser[])))
    )
)

export const fetchAdminReports = cache(() =>
    Effect.runPromise(
        getAdminReports().pipe(Effect.catchAll(() => Effect.succeed([] as AdminReport[])))
    )
)

export const fetchAdminFeedback = cache(() =>
    Effect.runPromise(
        getAdminFeedback().pipe(Effect.catchAll(() => Effect.succeed([] as AdminFeedback[])))
    )
)

export const fetchAdminLogs = cache(() =>
    Effect.runPromise(getAdminLogs().pipe(Effect.catchAll(() => Effect.succeed([] as AdminLog[]))))
)
