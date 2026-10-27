import 'server-only'

import type { GetAllCookies, SetAllCookies } from '@supabase/ssr/dist/main/types'
import { cookies } from 'next/headers'
import { ServerEnv } from '@/env/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

/**
 * Creates a DB server client without cookie-based session management and with SERVICE_ROLE_KEY
 *
 * Necessary for trigger.dev to run tasks from SB
 */
export const createDBAdminClient = () => {
    const SB_URL = ServerEnv.NEXT_SUPABASE_URL ?? process.env.NEXT_SUPABASE_URL!
    const SB_SERVICE_ROLE_KEY =
        ServerEnv.NEXT_SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!
    return createClient(SB_URL, SB_SERVICE_ROLE_KEY)
}

/**
 * Creates a DB server client with cookie-based session management.
 *
 * Always create a new client per request (required for Fluid compute).
 * @param hooks - Optional callbacks that run after the default cookie handlers.
 * @param hooks.onGetAll - Runs after reading all cookies from the cookie store.
 * @param hooks.onSetAll - Runs after writing cookies to the cookie store, receives the cookies that were set
 *   and the no-cache headers the response must carry alongside them.
 */
export async function createDBServerClient(
    useSecretKey?: boolean,
    hooks?: {
        onGetAll?: GetAllCookies
        onSetAll?: SetAllCookies
    }
) {
    const cookieStore = await cookies()

    return createServerClient(
        ServerEnv.NEXT_SUPABASE_URL,
        useSecretKey
            ? ServerEnv.NEXT_SUPABASE_SERVICE_ROLE_KEY
            : ServerEnv.NEXT_SUPABASE_PUBLISHABLE_KEY,
        {
            cookies: {
                getAll() {
                    const result = cookieStore.getAll()
                    hooks?.onGetAll?.()
                    return result
                },
                setAll(cookiesToSet, responseHeaders) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                        hooks?.onSetAll?.(cookiesToSet, responseHeaders)
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}
