import 'server-only'

import { Effect } from 'effect'
import { createSbServerClient } from '@/lib/utils.server'
import { CreateSbClientError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import type { User } from '@supabase/supabase-js'
import { selectUserReports } from '@/_bff/modules/reports/repositories/reports.repository'

export const getReports = Effect.fn('getReports')(function* (user: User) {
    const supabase = yield* Effect.tryPromise({
        try: () => createSbServerClient(),
        catch: (cause) =>
            new CreateSbClientError({ cause, error_hash: ErrorCode.REPORT_LIST_SB_CLIENT }),
    })

    return yield* selectUserReports(supabase, user.id)
})
