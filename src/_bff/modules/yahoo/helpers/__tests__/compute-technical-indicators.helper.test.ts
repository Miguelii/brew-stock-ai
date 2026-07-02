import { describe, it, expect } from 'vitest'
import { computeTechnicalIndicators } from '@/_bff/modules/yahoo/helpers/compute-technical-indicators.helper'
import type { PricePoint } from '@/_bff/modules/yahoo/types'

const DAY = 24 * 60 * 60 * 1000

// Build a series of `count` points with the given closes, spaced one day apart.
const series = (closes: number[]): PricePoint[] =>
    closes.map((close, i) => ({ date: i * DAY, close }))

describe('computeTechnicalIndicators', () => {
    it('returns all-null indicators for empty input', () => {
        const result = computeTechnicalIndicators([])
        expect(result.currentPrice).toBeNull()
        expect(result.sma50).toBeNull()
        expect(result.sma200).toBeNull()
        expect(result.rsi14).toBeNull()
        expect(result.trend).toBe('neutral')
        expect(result.annualizedVolatilityPct).toBeNull()
    })

    it('uses the latest close as current price and the extremes as 52w high/low', () => {
        const result = computeTechnicalIndicators(series([10, 5, 20, 15]))
        expect(result.currentPrice).toBe(15)
        expect(result.high52w).toBe(20)
        expect(result.low52w).toBe(5)
        expect(result.pctFrom52wHigh).toBeCloseTo((15 / 20 - 1) * 100, 6)
        expect(result.pctFrom52wLow).toBeCloseTo((15 / 5 - 1) * 100, 6)
    })

    it('sorts unordered points by date before computing', () => {
        const unordered: PricePoint[] = [
            { date: 3 * DAY, close: 15 },
            { date: 0, close: 10 },
            { date: 2 * DAY, close: 20 },
            { date: 1 * DAY, close: 5 },
        ]
        const result = computeTechnicalIndicators(unordered)
        expect(result.currentPrice).toBe(15)
    })

    it('computes SMA50/200 and the trend regime', () => {
        // 200 ascending points → price above both SMAs, SMA50 > SMA200 (golden).
        const ascending = computeTechnicalIndicators(
            series(Array.from({ length: 200 }, (_, i) => i + 1))
        )
        expect(ascending.sma50).toBeCloseTo(average(range(151, 200)), 6)
        expect(ascending.sma200).toBeCloseTo(average(range(1, 200)), 6)
        expect(ascending.trend).toBe('golden-cross')
        expect(ascending.priceVsSma50Pct).not.toBeNull()

        // 200 descending points → SMA50 < SMA200 (death cross).
        const descending = computeTechnicalIndicators(
            series(Array.from({ length: 200 }, (_, i) => 200 - i))
        )
        expect(descending.trend).toBe('death-cross')
    })

    it('returns null SMA200 when history is shorter than 200 points', () => {
        const result = computeTechnicalIndicators(
            series(Array.from({ length: 60 }, (_, i) => i + 1))
        )
        expect(result.sma50).not.toBeNull()
        expect(result.sma200).toBeNull()
        expect(result.priceVsSma200Pct).toBeNull()
    })

    it('returns RSI of 100 for a monotonically rising series', () => {
        const result = computeTechnicalIndicators(
            series(Array.from({ length: 30 }, (_, i) => i + 1))
        )
        expect(result.rsi14).toBe(100)
    })

    it('computes period returns from N trading days ago', () => {
        // 22 points (indices 0..21); 1m return compares index 0 to index 21.
        const closes = Array.from({ length: 22 }, (_, i) => 100 + i)
        const result = computeTechnicalIndicators(series(closes))
        expect(result.return1m).toBeCloseTo((121 / 100 - 1) * 100, 6)
        expect(result.return3m).toBeNull()
    })

    it('computes a positive annualised volatility for a fluctuating series', () => {
        const result = computeTechnicalIndicators(series([100, 110, 105, 115, 108, 120]))
        expect(result.annualizedVolatilityPct).not.toBeNull()
        expect(result.annualizedVolatilityPct!).toBeGreaterThan(0)
    })
})

// Test-local helpers mirroring the production maths for assertions.
function range(from: number, to: number): number[] {
    return Array.from({ length: to - from + 1 }, (_, i) => from + i)
}

function average(nums: number[]): number {
    return nums.reduce((sum, n) => sum + n, 0) / nums.length
}
