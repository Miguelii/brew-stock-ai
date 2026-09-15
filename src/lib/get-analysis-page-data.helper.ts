import 'server-only'

import { cache } from 'react'
import { Effect } from 'effect'
import { getCachedClaims } from '@/_bff/modules/auth/services/get-cached-claims.service'
import { isAppMaintenanceFlag } from '@/flags'

type AnalysisPageData = {
    isAuthenticated: boolean
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
                    isAuthenticated: Effect.tryPromise(() => getCachedClaims()).pipe(
                        Effect.map((claims) => claims !== null),
                        Effect.catchAll(() => Effect.succeed(false))
                    ),
                    isMaintenance: Effect.tryPromise(() => isAppMaintenanceFlag()).pipe(
                        Effect.catchAll(() => Effect.succeed(false))
                    ),
                },
                { concurrency: 'unbounded' }
            )
        )
)
