import type { NewsItem } from '@/types/news'
import { getNewsImageUrl } from '@/_bff/core/helpers/news-image.helper'
import { NEWS_CARD_LIST_SIZE, NEWS_LEAD_MAX_AGE_SECONDS } from '@/_bff/modules/finnhub/constants'

/**
 * Picks the stories for the report news card from a most-recent-first Finnhub list.
 * The newest recent story with a real photo comes first (the featured slot), followed
 * by the most recent remaining headlines. Placeholder and non-allowlisted images are
 * blanked, so the card never requests them.
 */
export function selectCardNews(items: NewsItem[], nowSeconds = Date.now() / 1000): NewsItem[] {
    const seenHeadlines = new Set<string>()
    const stories: NewsItem[] = []

    for (const item of items) {
        const headline = item.headline?.trim()
        if (!headline || !item.url) continue

        // Finnhub often lists the same story more than once
        const key = headline.toLowerCase()
        if (seenHeadlines.has(key)) continue
        seenHeadlines.add(key)

        stories.push({ ...item, headline, image: getNewsImageUrl(item.image) ?? '' })
    }

    const minLeadDatetime = nowSeconds - NEWS_LEAD_MAX_AGE_SECONDS
    const photoIndex = stories.findIndex(
        (story) => story.image !== '' && story.datetime >= minLeadDatetime
    )

    // Without a recent photo story, the newest headline takes the featured slot
    const [lead] = stories.splice(Math.max(photoIndex, 0), 1)
    if (!lead) return []

    return [lead, ...stories.slice(0, NEWS_CARD_LIST_SIZE)]
}
