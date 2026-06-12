import 'server-only'

import { Effect } from 'effect'
import { createSbAdminClient } from '@/lib/utils.server'
import { UnauthenticatedError } from '@/backend/lib/errors'
import { ErrorCode } from '@/backend/lib/error-codes'
import { isSuperAdmin } from '@/backend/modules/admin/helpers/is-super-admin.helper'
import { selectAdminFeedback } from '@/backend/modules/admin/repositories/admin.repository'

export type AdminFeedback = {
    id: string
    created_at: string
    name: string
    email: string
    message: string
    user_id: string | null
}

export const getAdminFeedback = Effect.fn('getAdminFeedback')(function* (callerEmail: string) {
    if (!isSuperAdmin(callerEmail)) {
        return yield* new UnauthenticatedError({ error_hash: ErrorCode.ADMIN_UNAUTH })
    }

    const supabase = createSbAdminClient()

    const feedback = yield* selectAdminFeedback(supabase)

    return feedback as AdminFeedback[]
})
