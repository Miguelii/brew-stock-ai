import { describe, it, expect } from 'vitest'
import { GET_PRICE_HISTORY_CACHE_KEY, GET_PRICE_HISTORY_TTL } from '@/_bff/modules/yahoo/constants'

describe('GET_PRICE_HISTORY_CACHE_KEY', () => {
    it('is the expected cache key', () => {
        expect(GET_PRICE_HISTORY_CACHE_KEY).toBe('price-history')
    })
})

describe('GET_PRICE_HISTORY_TTL', () => {
    it('is 12 hours expressed in seconds', () => {
        expect(GET_PRICE_HISTORY_TTL).toBe(12 * 60 * 60)
    })

    it('is a positive integer', () => {
        expect(Number.isInteger(GET_PRICE_HISTORY_TTL)).toBe(true)
        expect(GET_PRICE_HISTORY_TTL).toBeGreaterThan(0)
    })
})
