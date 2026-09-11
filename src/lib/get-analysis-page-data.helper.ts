import 'server-only'

import { cache } from 'react'
import { Effect } from 'effect'
import type { User } from '@supabase/supabase-js'
import { getCachedSession } from '@/_bff/modules/auth/services/get-cached-session.service'
import { isAppMaintenanceFlag } from '@/flags'

type AnalysisPageData = {
    user: User | null
    isMaintenance: boolean
}

/**
 * Runs the session lookup and the maintenance flag evaluation in parallel.
 * Each branch catches its own failure before joining, so one failing falls
 * back to its default instead of taking the other down with it.
 */
export const getAnalysisPageData = cache(
    (): Promise<AnalysisPageData> =>
        Effect.runPromise(
            Effect.all(
                {
                    user: Effect.tryPromise(() => getCachedSession()).pipe(
                        Effect.catchAll(() => Effect.succeed(null))
                    ),
                    isMaintenance: Effect.tryPromise(() => isAppMaintenanceFlag()).pipe(
                        Effect.catchAll(() => Effect.succeed(false))
                    ),
                },
                { concurrency: 'unbounded' }
            )
        )
)
