import { DEFAULT_POST_AUTH_PATH } from '@/lib/constants'

export { cn } from 'cn'

export const pluralizeCredits = (count: number) => (count === 1 ? 'credit' : 'credits')

/**
 * Client-side twin of `safeRedirectUrl`: accepts only same-site absolute paths, so
 * a crafted `returnTo` cannot send a freshly authenticated visitor to another
 * origin. Protocol-relative forms (`//host`, `/\host`) are rejected with the rest.
 */
export const safeReturnTo = (
    returnTo: string | null | undefined,
    fallback: string = DEFAULT_POST_AUTH_PATH
) => {
    if (!returnTo?.startsWith('/')) return fallback
    if (returnTo.startsWith('//') || returnTo.startsWith('/\\')) return fallback

    return returnTo
}
