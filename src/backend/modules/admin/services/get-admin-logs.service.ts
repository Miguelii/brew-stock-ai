import 'server-only'

import { Effect } from 'effect'
import { createSbAdminClient } from '@/lib/utils.server'
import { UnauthenticatedError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import { isSuperAdmin } from '@/backend/modules/admin/helpers/is-super-admin.helper'
import { selectAdminLogs } from '@/backend/modules/admin/repositories/admin.repository'

export type LogLevel = 'log' | 'info' | 'warn' | 'error'

export type AdminLog = {
    id: number
    created_at: string
    level: LogLevel
    prefix: string | null
    message: string | null
    metadata: Record<string, unknown> | null
    user_id: string | null
}

export const getAdminLogs = Effect.fn('getAdminLogs')(function* (callerEmail: string) {
    if (!isSuperAdmin(callerEmail)) {
        return yield* new UnauthenticatedError({ error_hash: ErrorCode.ADMIN_UNAUTH })
    }

    const supabase = createSbAdminClient()

    const logs = yield* selectAdminLogs(supabase)

    return logs as AdminLog[]
})
