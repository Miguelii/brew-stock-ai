import 'server-only'

import { Effect } from 'effect'
import { createSbAdminClient } from '@/lib/utils.server'
import { UnauthenticatedError } from '@/_backend/lib/errors'
import { ErrorCode } from '@/_backend/lib/error-codes'
import { isAdmin } from '@/_backend/modules/admin/services/is-admin.service'
import { selectAdminFeedback } from '@/_backend/modules/admin/repositories/admin.repository'

export type AdminFeedback = {
    id: string
    created_at: string
    name: string
    email: string
    message: string
    user_id: string | null
}

export const getAdminFeedback = Effect.fn('getAdminFeedback')(function* () {
    if (!(yield* isAdmin())) {
        return yield* new UnauthenticatedError({ error_hash: ErrorCode.ADMIN_UNAUTH })
    }

    const supabase = createSbAdminClient()

    const feedback = yield* selectAdminFeedback(supabase)

    return feedback as AdminFeedback[]
})
