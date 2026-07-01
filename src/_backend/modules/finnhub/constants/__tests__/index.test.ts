import { describe, it, expect } from 'vitest'
import { LATEST_NEWS_CACHE_KEY, LATEST_NEWS_TTL } from '@/_backend/modules/finnhub/constants'

describe('LATEST_NEWS_CACHE_KEY', () => {
    it('is the expected cache key', () => {
        expect(LATEST_NEWS_CACHE_KEY).toBe('latest-news')
    })
})

describe('LATEST_NEWS_TTL', () => {
    it('is 1 day expressed in seconds', () => {
        expect(LATEST_NEWS_TTL).toBe(24 * 60 * 60)
    })

    it('is a positive integer', () => {
        expect(Number.isInteger(LATEST_NEWS_TTL)).toBe(true)
        expect(LATEST_NEWS_TTL).toBeGreaterThan(0)
    })
})
