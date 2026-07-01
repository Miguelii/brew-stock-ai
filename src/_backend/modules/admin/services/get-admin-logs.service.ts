import 'server-only'

import { Effect } from 'effect'
import { createSbAdminClient } from '@/lib/utils.server'
import { UnauthenticatedError } from '@/_backend/lib/errors'
import { ErrorCode } from '@/_backend/lib/error-codes'
import { isAdmin } from '@/_backend/modules/admin/services/is-admin.service'
import { selectAdminLogs } from '@/_backend/modules/admin/repositories/admin.repository'

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

export const getAdminLogs = Effect.fn('getAdminLogs')(function* () {
    if (!(yield* isAdmin())) {
        return yield* new UnauthenticatedError({ error_hash: ErrorCode.ADMIN_UNAUTH })
    }

    const supabase = createSbAdminClient()

    const logs = yield* selectAdminLogs(supabase)

    return logs as AdminLog[]
})
