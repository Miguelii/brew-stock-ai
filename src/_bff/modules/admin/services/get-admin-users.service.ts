import 'server-only'

import { Effect } from 'effect'
import { createSbAdminClient } from '@/lib/utils.server'
import { UnauthenticatedError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import { isAdmin } from '@/_bff/modules/admin/services/is-admin.service'
import { listUsers, selectAllUserCredits } from '@/_bff/modules/admin/repositories/admin.repository'

export type AdminUser = {
    id: string
    email: string
    created_at: string
    last_sign_in_at: string | null
    provider: string | null
    credits: number
}

export const getAdminUsers = Effect.fn('getAdminUsers')(function* () {
    if (!(yield* isAdmin())) {
        return yield* new UnauthenticatedError({ error_hash: ErrorCode.ADMIN_UNAUTH })
    }

    const supabase = createSbAdminClient()

    const [users, userCredits] = yield* Effect.all(
        [listUsers(supabase), selectAllUserCredits(supabase)],
        { concurrency: 'unbounded' }
    )

    const creditsByUserId = new Map(userCredits.map((c) => [c.user_id, c.credits]))

    return users.map((u) => ({
        id: u.id,
        email: u.email ?? '—',
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
        provider: (u.app_metadata?.provider as string | undefined) ?? null,
        credits: creditsByUserId.get(u.id) ?? 0,
    })) satisfies AdminUser[]
})
