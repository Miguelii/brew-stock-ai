import { createHash, timingSafeEqual } from 'node:crypto'

const digest = (value: string) => createHash('sha256').update(value).digest()

/**
 * Constant-time bearer check. Hashing first gives both sides the same length,
 * which `timingSafeEqual` requires. No configured token means every call is rejected.
 */
export const verifyMcpToken = (
    bearerToken: string | undefined,
    expectedToken: string | undefined
) => {
    if (!expectedToken || !bearerToken) return false

    return timingSafeEqual(digest(bearerToken), digest(expectedToken))
}
