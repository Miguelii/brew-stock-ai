import { cache } from 'react'
import { Effect } from 'effect'
import { getSession } from '@/services/supabase/get-session'

/**
 * Cached session getter — deduplicates Supabase calls within the same request.
 * Safe to call from multiple Server Components (layout, pages, etc.).
 */
export const getCachedSession = cache(() =>
    Effect.runPromise(getSession().pipe(Effect.catchAll(() => Effect.succeed(null))))
)
