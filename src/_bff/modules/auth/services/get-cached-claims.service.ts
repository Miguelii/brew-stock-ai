import 'server-only'

import { cache } from 'react'
import { createDBServerClient } from '@/_bff/core/db'

export type SessionClaims = {
    userId: string
    email: string | null
    avatarUrl: string | null
    fullName: string | null
}

/**
 * Current user's identity for rendering UI (navigation, avatar, auth-aware CTAs).
 *
 * Reads the access token via `getClaims()`, which verifies the JWT locally
 * (WebCrypto) with asymmetric signing keys, so there is no `getUser()` network
 * round-trip blocking the render. Wrapped in React `cache()` so it runs at most
 * once per request. Never throws: returns null on any failure or when signed out.
 *
 * UI only. Authorization decisions keep going through `getSession()`.
 */
export const getCachedClaims = cache(async (): Promise<SessionClaims | null> => {
    try {
        const supabase = await createDBServerClient()
        const { data } = await supabase.auth.getClaims()
        const claims = data?.claims

        if (!claims?.sub) return null

        const metadata = claims.user_metadata

        return {
            userId: claims.sub,
            email: typeof claims.email === 'string' ? claims.email : null,
            avatarUrl: typeof metadata?.avatar_url === 'string' ? metadata.avatar_url : null,
            fullName: typeof metadata?.full_name === 'string' ? metadata.full_name : null,
        }
    } catch {
        return null
    }
})
