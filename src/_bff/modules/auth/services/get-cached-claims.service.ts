import 'server-only'

import { cache } from 'react'
import { z } from 'zod'
import { createDBServerClient } from '@/_bff/core/db'

export type SessionClaims = {
    userId: string
    email: string | null
    avatarUrl: string | null
    fullName: string | null
}

// JWT claims are user-editable metadata: a missing or malformed field reads as null
const optionalClaim = z.string().nullable().catch(null)

const ClaimsSchema = z.object({
    sub: z.string().min(1),
    email: optionalClaim,
    user_metadata: z
        .object({ avatar_url: optionalClaim, full_name: optionalClaim })
        .catch({ avatar_url: null, full_name: null }),
})

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
        const claims = ClaimsSchema.safeParse(data?.claims)

        if (!claims.success) return null

        return {
            userId: claims.data.sub,
            email: claims.data.email,
            avatarUrl: claims.data.user_metadata.avatar_url,
            fullName: claims.data.user_metadata.full_name,
        }
    } catch {
        return null
    }
})
