import { NEWS_IMAGE_SOURCES } from '@/_bff/core/constants/news.constants'

/**
 * Returns the news image URL when it is an https photo from an allowlisted source
 * (the same list next/image accepts), or null for placeholders, unknown hosts and
 * malformed values.
 */
export function getNewsImageUrl(image: string | null | undefined): string | null {
    if (!image) return null

    let url: URL
    try {
        url = new URL(image)
    } catch {
        return null
    }

    if (url.protocol !== 'https:') return null

    const isAllowed = NEWS_IMAGE_SOURCES.some(
        ({ hostname, pathnamePrefix }) =>
            url.hostname === hostname && url.pathname.startsWith(pathnamePrefix)
    )

    return isAllowed ? url.href : null
}
