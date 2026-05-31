import 'server-only'

import type { GetAllCookies, SetAllCookies } from '@supabase/ssr/dist/main/types'
import { cookies, headers } from 'next/headers'
import { ServerEnv } from '@/env/server'
import { type NextRequest, NextResponse } from 'next/server'
import { AUTH_PAGES_PATHS, HOME_PAGE_PATH, PROTECTED_PATHS } from '@/lib/constants'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase server client without cookie-based session management and with SERVICE_ROLE_KEY
 *
 * Necessary for trigger dev to run task from SB
 */
export const createSbAdminClient = () =>
    createClient(process.env.NEXT_SUPABASE_URL!, process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!)

/**
 * Creates a Supabase server client with cookie-based session management.
 *
 * Always create a new client per request (required for Fluid compute).
 * @param hooks - Optional callbacks that run after the default cookie handlers.
 * @param hooks.onGetAll - Runs after reading all cookies from the cookie store.
 * @param hooks.onSetAll - Runs after writing cookies to the cookie store, receives the cookies that were set.
 */
export async function createSbServerClient(
    useSecretKey?: boolean,
    hooks?: {
        onGetAll?: GetAllCookies
        onSetAll?: SetAllCookies
    }
) {
    const [cookieStore, headersStore] = await Promise.all([cookies(), headers()])

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
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                        //
                        hooks?.onSetAll?.(
                            cookiesToSet,
                            headersStore as unknown as Record<string, string>
                        )
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

/**
 * Supabase auth proxy for Next.js middleware.
 * Refreshes the user session via `getClaims()` and syncs auth cookies
 * between the incoming request and outgoing response.
 * Redirects unauthenticated users away from protected routes.
 * @param request - The incoming Next.js middleware request.
 */
export async function sbProxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // With Fluid compute, don't put this client in a global environment
    // variable. Always create a new one on each request.
    const supabase = await createSbServerClient(false, {
        onSetAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
                request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
            )
        },
    })

    // Do not run code between createServerClient and
    // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.
    // IMPORTANT: If you remove getClaims() and you use server-side rendering
    // with the Supabase client, your users may be randomly logged out.
    const { data } = await supabase.auth.getClaims()

    const user = data?.claims

    if (!user && [...PROTECTED_PATHS].some((path) => request.nextUrl.pathname.startsWith(path))) {
        const url = request.nextUrl.clone()
        url.pathname = HOME_PAGE_PATH
        return NextResponse.redirect(url)
    }

    if (user && [...AUTH_PAGES_PATHS].some((path) => request.nextUrl.pathname.startsWith(path))) {
        const url = request.nextUrl.clone()
        url.pathname = HOME_PAGE_PATH
        return NextResponse.redirect(url)
    }

    // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
    // creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!
    return supabaseResponse
}

/**
 * Resolves `next` against `siteUrl` and returns the resulting URL only if it
 * stays on the same origin, preventing open-redirect attacks via
 * protocol-relative paths such as `//evil.com`.
 *
 * Falls back to `/analysis` when the resolved origin differs from the site origin.
 */
export function safeRedirectUrl(next: string, siteUrl: string): URL {
    const resolved = new URL(next, siteUrl)
    const base = new URL(siteUrl)
    if (resolved.origin !== base.origin) {
        return new URL('/analysis', siteUrl)
    }
    return resolved
}

export const getIsDev = (): boolean => {
    return process.env.NODE_ENV === 'development'
}
