import { describe, it, expect } from 'vitest'
import {
    YAHOO_DATA_TTL,
    GET_PRICE_HISTORY_CACHE_KEY,
    GET_PRICE_HISTORY_TTL,
} from '@/_bff/modules/yahoo/constants'

describe('YAHOO_DATA_TTL', () => {
    it('is 3 days expressed in milliseconds', () => {
        expect(YAHOO_DATA_TTL).toBe(3 * 24 * 60 * 60 * 1000)
    })

    it('is a positive integer', () => {
        expect(Number.isInteger(YAHOO_DATA_TTL)).toBe(true)
        expect(YAHOO_DATA_TTL).toBeGreaterThan(0)
    })
})

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
