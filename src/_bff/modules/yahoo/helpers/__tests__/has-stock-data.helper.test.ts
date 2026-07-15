import { describe, expect, it } from 'vitest'
import { hasStockData } from '@/_bff/modules/yahoo/helpers/has-stock-data.helper'

describe('hasStockData', () => {
    it('returns false for nullish values', () => {
        expect(hasStockData(null)).toBe(false)
        // oxlint-disable-next-line unicorn/no-useless-undefined
        expect(hasStockData(undefined)).toBe(false)
    })

    it('returns false for empty collections', () => {
        expect(hasStockData([])).toBe(false)
        expect(hasStockData({})).toBe(false)
    })

    it('returns false for objects whose values are all nullish', () => {
        expect(hasStockData({ currentPrice: null, marketCap: null })).toBe(false)
        expect(hasStockData({ currentPrice: undefined })).toBe(false)
    })

    it('returns true for populated collections', () => {
        expect(hasStockData([1])).toBe(true)
        expect(hasStockData({ value: 1 })).toBe(true)
    })

    it('returns true for defined primitive values', () => {
        expect(hasStockData(0)).toBe(true)
        expect(hasStockData(false)).toBe(true)
        expect(hasStockData('AAPL')).toBe(true)
    })
})
