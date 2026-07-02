import 'server-only'

import { Effect } from 'effect'
import { createSbAdminClient } from '@/lib/utils.server'
import { UnauthenticatedError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import { isAdmin } from '@/_bff/modules/admin/services/is-admin.service'
import { selectAdminReports } from '@/_bff/modules/admin/repositories/admin.repository'
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
    cost: string
}

export const getAdminReports = Effect.fn('getAdminReports')(function* () {
    if (!(yield* isAdmin())) {
        return yield* new UnauthenticatedError({ error_hash: ErrorCode.ADMIN_UNAUTH })
    }

    const supabase = createSbAdminClient()

    const reports = yield* selectAdminReports(supabase)

    return reports as AdminReport[]
})
