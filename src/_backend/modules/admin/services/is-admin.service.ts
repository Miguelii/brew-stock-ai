import 'server-only'

import { Effect } from 'effect'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError } from '@/_backend/lib/errors'
import { ErrorCode } from '@/_backend/lib/error-codes'
import { checkIsAdmin } from '@/_backend/modules/admin/repositories/admin.repository'

// Resolves admin status via public.is_admin(). Needs a session-aware client so auth.uid()
// resolves the caller; pass one in to reuse an existing client, else create a server client.
export const isAdmin = Effect.fn('isAdmin')(function* (client?: SupabaseClient) {
    const supabase =
        client ??
        (yield* Effect.tryPromise({
            try: () => createSbServerClient(),
            catch: (cause) =>
                new CreateSbClientError({ cause, error_hash: ErrorCode.ADMIN_IS_ADMIN_SB_CLIENT }),
        }))

    return yield* checkIsAdmin(supabase)
})
