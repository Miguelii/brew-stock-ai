import { describe, it, expect } from 'vitest'
import { calculateTokenCost } from '../calculate-token-cost.helper'

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
        // inputPerMTok: 0.8 | outputPerMTok: 4
        it('calculates cost with 1 million input and output tokens', () => {
            // (1_000_000 / 1_000_000) * 0.8 + (1_000_000 / 1_000_000) * 4 = 4.8
            expect(calculateTokenCost('claude-haiku-4-5', 1_000_000, 1_000_000)).toBe(4.8)
        })

        it('calculates cost with typical usage values', () => {
            // (500 / 1_000_000) * 0.8 + (200 / 1_000_000) * 4
            // = 0.0004 + 0.0008 = 0.0012
            expect(calculateTokenCost('claude-haiku-4-5', 500, 200)).toBeCloseTo(0.0012, 10)
        })

        it('calculates cost with large input tokens and minimal output', () => {
            // (2_000_000 / 1_000_000) * 0.8 + (1 / 1_000_000) * 4
            // = 1.6 + 0.000004 = 1.600004
            expect(calculateTokenCost('claude-haiku-4-5', 2_000_000, 1)).toBeCloseTo(1.600004, 6)
        })
    })

    describe('correct calculation for claude-sonnet-4-5-20250929', () => {
        // inputPerMTok: 3 | outputPerMTok: 15
        it('calculates cost with 1 million input and output tokens', () => {
            // (1_000_000 / 1_000_000) * 3 + (1_000_000 / 1_000_000) * 15 = 18
            expect(calculateTokenCost('claude-sonnet-4-5-20250929', 1_000_000, 1_000_000)).toBe(18)
        })

        it('calculates cost with typical usage values', () => {
            // (1000 / 1_000_000) * 3 + (500 / 1_000_000) * 15
            // = 0.003 + 0.0075 = 0.0105
            expect(calculateTokenCost('claude-sonnet-4-5-20250929', 1000, 500)).toBeCloseTo(
                0.0105,
                10
            )
        })

        it('calculates correctly when output dominates the cost', () => {
            // (100 / 1_000_000) * 3 + (900 / 1_000_000) * 15
            // = 0.0003 + 0.0135 = 0.0138
            expect(calculateTokenCost('claude-sonnet-4-5-20250929', 100, 900)).toBeCloseTo(
                0.0138,
                10
            )
        })
    })

    describe('returns a number (not N/A) for valid models with valid tokens', () => {
        it('result is of type number for haiku with valid tokens', () => {
            const result = calculateTokenCost('claude-haiku-4-5', 1000, 1000)
            expect(typeof result).toBe('number')
        })

        it('result is of type number for sonnet with valid tokens', () => {
            const result = calculateTokenCost('claude-sonnet-4-5-20250929', 1000, 1000)
            expect(typeof result).toBe('number')
        })

        it('result is never negative for positive inputs', () => {
            const result = calculateTokenCost('claude-haiku-4-5', 1, 1)
            expect(result).toBeGreaterThan(0)
        })
    })
})
