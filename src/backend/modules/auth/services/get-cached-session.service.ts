import 'server-only'

import { cache } from 'react'
import { Effect } from 'effect'
import { getSession } from '@/backend/modules/auth/services/get-session.service'

/**
 * Cached session getter for Server Components (layout, pages, etc.).
 *
 * Backed by the same request-cached `getUser()` as the service-layer
 * `getSession`, so components and services running in the same request share a
 * single Supabase auth round-trip.
 */
export const getCachedSession = cache(() =>
    Effect.runPromise(getSession().pipe(Effect.catchAll(() => Effect.succeed(null))))
)
