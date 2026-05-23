import 'server-only'

import { Effect } from 'effect'
import { createSbAdminClient } from '@/lib/utils.server'
import { AdminStatsError } from '@/services/errors'
import { ErrorCode } from '@/services/error-codes'

export type AdminUser = {
    id: string
    email: string
    created_at: string
    last_sign_in_at: string | null
}

export const getAdminUsers = Effect.fn('getAdminUsers')(function* () {
    const supabase = createSbAdminClient()

    const result = yield* Effect.tryPromise({
        try: () => supabase.auth.admin.listUsers({ perPage: 1000, page: 1 }),
        catch: (cause) => new AdminStatsError({ cause, error_hash: ErrorCode.ADMIN_STATS_FETCH }),
    })

    return result.data.users.map((u) => ({
        id: u.id,
        email: u.email ?? '—',
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
    })) satisfies AdminUser[]
})
