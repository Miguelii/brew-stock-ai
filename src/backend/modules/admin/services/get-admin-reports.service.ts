import 'server-only'

import { Effect } from 'effect'
import { createSbAdminClient } from '@/lib/utils.server'
import { UnauthenticatedError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import { isSuperAdmin } from '@/backend/modules/admin/helpers/is-super-admin.helper'
import { selectAdminReports } from '@/backend/modules/admin/repositories/admin.repository'
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

export const getAdminReports = Effect.fn('getAdminReports')(function* (callerEmail: string) {
    if (!isSuperAdmin(callerEmail)) {
        return yield* new UnauthenticatedError({ error_hash: ErrorCode.ADMIN_UNAUTH })
    }

    const supabase = createSbAdminClient()

    const reports = yield* selectAdminReports(supabase)

    return reports as AdminReport[]
})
