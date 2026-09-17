import { describe, it, expect } from 'vitest'
import {
    categoryAnchor,
    fmtSignedCount,
    fmtSignedPct,
} from '@/modules/report-view/report-financials-card/utils'

describe('categoryAnchor', () => {
    it('prefixes the category id', () => {
        expect(categoryAnchor('growth')).toBe('key-metrics-growth')
    })
})

describe('fmtSignedPct', () => {
    it('adds a plus sign to positive ratios only', () => {
        expect(fmtSignedPct(0.12)).toBe('+12.0%')
        expect(fmtSignedPct(-0.03)).toBe('-3.0%')
        expect(fmtSignedPct(0)).toBe('0.0%')
    })

    it('returns N/A for missing values', () => {
        expect(fmtSignedPct(null)).toBe('N/A')
    })
})

describe('fmtSignedCount', () => {
    it('keeps the thousands separators and the sign', () => {
        expect(fmtSignedCount(120_000)).toBe('+120,000')
        expect(fmtSignedCount(-120_000)).toBe('-120,000')
        expect(fmtSignedCount(0)).toBe('0')
    })

    it('returns N/A for missing values', () => {
        // oxlint-disable-next-line unicorn/no-useless-undefined
        expect(fmtSignedCount(undefined)).toBe('N/A')
    })
})
