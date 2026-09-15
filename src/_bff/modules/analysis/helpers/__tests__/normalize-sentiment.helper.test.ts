import { describe, it, expect } from 'vitest'
import { normalizeSentiment } from '@/_bff/modules/analysis/helpers/normalize-sentiment.helper'

describe('normalizeSentiment', () => {
    it('keeps an integer already inside the range', () => {
        expect(normalizeSentiment(0)).toBe(0)
        expect(normalizeSentiment(63)).toBe(63)
        expect(normalizeSentiment(100)).toBe(100)
    })

    it('rounds decimals to the nearest integer', () => {
        expect(normalizeSentiment(42.4)).toBe(42)
        expect(normalizeSentiment(42.5)).toBe(43)
    })

    it('clamps values below 0 and above 100', () => {
        expect(normalizeSentiment(-12)).toBe(0)
        expect(normalizeSentiment(150)).toBe(100)
    })

    it('falls back to neutral for non-finite values', () => {
        expect(normalizeSentiment(Number.NaN)).toBe(50)
        expect(normalizeSentiment(Number.POSITIVE_INFINITY)).toBe(50)
    })
})
