import { describe, it, expect } from 'vitest'
import { calculateTokenCost } from '@/_bff/modules/analysis/helpers/calculate-token-cost.helper'

describe('calculateTokenCost', () => {
    describe('unknown or invalid model', () => {
        it('returns N/A for an unknown model', () => {
            expect(calculateTokenCost('gpt-4o', 1000, 500)).toBe('N/A')
        })

        it('returns N/A for an empty string as model', () => {
            expect(calculateTokenCost('', 1000, 500)).toBe('N/A')
        })
    })

    describe('missing or invalid tokens', () => {
        it('returns N/A when promptTokens is undefined', () => {
            expect(calculateTokenCost('claude-haiku-4-5', undefined, 500)).toBe('N/A')
        })

        it('returns N/A when completionTokens is undefined', () => {
            // oxlint-disable-next-line unicorn/no-useless-undefined
            expect(calculateTokenCost('claude-haiku-4-5', 1000, undefined)).toBe('N/A')
        })

        it('returns N/A when both tokens are undefined', () => {
            // oxlint-disable-next-line unicorn/no-useless-undefined
            expect(calculateTokenCost('claude-haiku-4-5', undefined, undefined)).toBe('N/A')
        })

        it('returns N/A when promptTokens is 0 (falsy)', () => {
            expect(calculateTokenCost('claude-haiku-4-5', 0, 500)).toBe('N/A')
        })

        it('returns N/A when completionTokens is 0 (falsy)', () => {
            expect(calculateTokenCost('claude-haiku-4-5', 1000, 0)).toBe('N/A')
        })

        it('returns N/A when both tokens are 0', () => {
            expect(calculateTokenCost('claude-haiku-4-5', 0, 0)).toBe('N/A')
        })
    })

    describe('correct calculation for claude-haiku-4-5', () => {
        // inputPerMTok: 1 | outputPerMTok: 5
        it('calculates cost with 1 million input and output tokens', () => {
            // (1_000_000 / 1_000_000) * 1 + (1_000_000 / 1_000_000) * 5 = 6
            expect(calculateTokenCost('claude-haiku-4-5', 1_000_000, 1_000_000)).toBe(6)
        })

        it('calculates cost with typical usage values', () => {
            // (500 / 1_000_000) * 1 + (200 / 1_000_000) * 5
            // = 0.0005 + 0.001 = 0.0015
            expect(calculateTokenCost('claude-haiku-4-5', 500, 200)).toBeCloseTo(0.0015, 10)
        })

        it('calculates cost with large input tokens and minimal output', () => {
            // (2_000_000 / 1_000_000) * 1 + (1 / 1_000_000) * 5
            // = 2 + 0.000005 = 2.000005
            expect(calculateTokenCost('claude-haiku-4-5', 2_000_000, 1)).toBeCloseTo(2.000005, 6)
        })
    })

    describe('correct calculation for claude-sonnet-5', () => {
        // inputPerMTok: 2 | outputPerMTok: 10
        it('calculates cost with 1 million input and output tokens', () => {
            // (1_000_000 / 1_000_000) * 2 + (1_000_000 / 1_000_000) * 10 = 12
            expect(calculateTokenCost('claude-sonnet-5', 1_000_000, 1_000_000)).toBe(12)
        })

        it('calculates cost with typical usage values', () => {
            // (1000 / 1_000_000) * 2 + (500 / 1_000_000) * 10
            // = 0.002 + 0.005 = 0.007
            expect(calculateTokenCost('claude-sonnet-5', 1000, 500)).toBeCloseTo(0.007, 10)
        })

        it('calculates correctly when output dominates the cost', () => {
            // (100 / 1_000_000) * 2 + (900 / 1_000_000) * 10
            // = 0.0002 + 0.009 = 0.0092
            expect(calculateTokenCost('claude-sonnet-5', 100, 900)).toBeCloseTo(0.0092, 10)
        })

        it('returns N/A for the retired claude-sonnet-4-5-20250929 id', () => {
            expect(calculateTokenCost('claude-sonnet-4-5-20250929', 1000, 500)).toBe('N/A')
        })
    })

    describe('returns a number (not N/A) for valid models with valid tokens', () => {
        it('result is of type number for haiku with valid tokens', () => {
            const result = calculateTokenCost('claude-haiku-4-5', 1000, 1000)
            expect(result).toBeCloseTo(0.006)
        })

        it('result is of type number for sonnet with valid tokens', () => {
            const result = calculateTokenCost('claude-sonnet-5', 1000, 1000)
            expect(result).toBeCloseTo(0.012)
        })

        it('result is never negative for positive inputs', () => {
            const result = calculateTokenCost('claude-haiku-4-5', 1, 1)
            expect(result).toBeGreaterThan(0)
        })
    })
})
