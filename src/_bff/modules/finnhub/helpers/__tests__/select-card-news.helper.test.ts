import { describe, it, expect } from 'vitest'
import type { NewsItem } from '@/types/news'
import { selectCardNews } from '@/_bff/modules/finnhub/helpers/select-card-news.helper'

const NOW = 1_800_000_000
const HOUR = 60 * 60
const DAY = 24 * HOUR

const YAHOO_PLACEHOLDER = 'https://s.yimg.com/rz/stage/p/yahoo_finance_en-US_h_p_finance_2.png'
const BENZINGA_PHOTO = 'https://cdn.benzinga.com/files/images/story/2026/09/16/Apple.jpg'

const makeItem = (id: number, overrides: Partial<NewsItem> = {}): NewsItem => ({
    category: 'company',
    datetime: NOW - id * HOUR,
    headline: `Headline ${id}`,
    id,
    image: YAHOO_PLACEHOLDER,
    source: 'Yahoo',
    summary: `Summary ${id}`,
    url: `https://finance.yahoo.com/news/${id}`,
    ...overrides,
})

const ids = (items: NewsItem[]) => items.map((item) => item.id)

describe('selectCardNews', () => {
    it('returns an empty list for an empty response', () => {
        expect(selectCardNews([], NOW)).toEqual([])
    })

    it('features the newest recent photo story, then the most recent headlines', () => {
        const items = [
            makeItem(1),
            makeItem(2),
            makeItem(3, { image: BENZINGA_PHOTO, source: 'Benzinga' }),
            makeItem(4),
            makeItem(5),
            makeItem(6),
        ]

        const result = selectCardNews(items, NOW)

        expect(ids(result)).toEqual([3, 1, 2, 4, 5])
        expect(result[0]?.image).toBe(BENZINGA_PHOTO)
    })

    it('falls back to the newest headline when no story has a real photo', () => {
        const items = [makeItem(1), makeItem(2), makeItem(3)]

        expect(ids(selectCardNews(items, NOW))).toEqual([1, 2, 3])
    })

    it('does not feature a photo story older than a week', () => {
        const items = [makeItem(1), makeItem(2, { image: BENZINGA_PHOTO, datetime: NOW - 8 * DAY })]

        expect(ids(selectCardNews(items, NOW))).toEqual([1, 2])
    })

    it('blanks placeholder and non-allowlisted images', () => {
        const items = [
            makeItem(1),
            makeItem(2, { image: 'https://example.com/photo.jpg' }),
            makeItem(3, { image: '' }),
        ]

        expect(selectCardNews(items, NOW).map((item) => item.image)).toEqual(['', '', ''])
    })

    it('drops duplicate headlines, keeping the most recent copy', () => {
        const items = [
            makeItem(1, { headline: 'Apple beats estimates' }),
            makeItem(2, { headline: '  apple beats estimates ' }),
            makeItem(3),
        ]

        expect(ids(selectCardNews(items, NOW))).toEqual([1, 3])
    })

    it('drops items without a headline or url', () => {
        const items = [makeItem(1, { headline: '   ' }), makeItem(2, { url: '' }), makeItem(3)]

        expect(ids(selectCardNews(items, NOW))).toEqual([3])
    })

    it('caps the list at one featured story plus four headlines', () => {
        const items = Array.from({ length: 20 }, (_, i) => makeItem(i + 1))

        expect(selectCardNews(items, NOW)).toHaveLength(5)
    })
})
