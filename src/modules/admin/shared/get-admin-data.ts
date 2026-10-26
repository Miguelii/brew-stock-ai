import 'server-only'

import { cache } from 'react'
import { Effect } from 'effect'
import {
    getAdminStats,
    type AdminStats,
} from '@/_bff/modules/admin/services/get-admin-stats.service'
import {
    getAdminUsers,
    type AdminUser,
} from '@/_bff/modules/admin/services/get-admin-users.service'
import {
    getAdminReports,
    type AdminReport,
} from '@/_bff/modules/admin/services/get-admin-reports.service'
import {
    getAdminFeedback,
    type AdminFeedback,
} from '@/_bff/modules/admin/services/get-admin-feedback.service'
import { getAdminLogs, type AdminLog } from '@/_bff/modules/admin/services/get-admin-logs.service'
import {
    getAdminStockData,
    type AdminStockData,
} from '@/_bff/modules/admin/services/get-admin-stock-data.service'
import { isAdmin } from '@/_bff/modules/admin/services/is-admin.service'

const EMPTY_STATS: AdminStats = {
    totalReports: 0,
    completedReports: 0,
    failedReports: 0,
    totalUsers: 0,
}

export const fetchIsAdmin = cache(() =>
    Effect.runPromise(isAdmin().pipe(Effect.catch(() => Effect.succeed(false))))
)

export const fetchAdminStats = cache(() =>
    Effect.runPromise(getAdminStats().pipe(Effect.catch(() => Effect.succeed(EMPTY_STATS))))
)

export const fetchAdminUsers = cache(() =>
    Effect.runPromise(getAdminUsers().pipe(Effect.catch(() => Effect.succeed<AdminUser[]>([]))))
)

export const fetchAdminReports = cache(() =>
    Effect.runPromise(getAdminReports().pipe(Effect.catch(() => Effect.succeed<AdminReport[]>([]))))
)

export const fetchAdminFeedback = cache(() =>
    Effect.runPromise(
        getAdminFeedback().pipe(Effect.catch(() => Effect.succeed<AdminFeedback[]>([])))
    )
)

export const fetchAdminLogs = cache(() =>
    Effect.runPromise(getAdminLogs().pipe(Effect.catch(() => Effect.succeed<AdminLog[]>([]))))
)

export const fetchAdminStockData = cache(() =>
    Effect.runPromise(
        getAdminStockData().pipe(Effect.catch(() => Effect.succeed<AdminStockData[]>([])))
    )
)
