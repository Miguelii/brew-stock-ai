import { describe, it, expect } from 'vitest'
import {
    fmtCount,
    fmtDelta,
    fmtSignedCount,
    fmtSignedPct,
    truncateText,
} from '@/_bff/core/utils/formatters.utils'

describe('fmtCount', () => {
    it('adds thousands separators', () => {
        expect(fmtCount(1_076_536)).toBe('1,076,536')
        expect(fmtCount(null)).toBe('N/A')
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

describe('fmtDelta', () => {
    it('signs positive gaps only', () => {
        expect(fmtDelta(45)).toBe('+45')
        expect(fmtDelta(-33)).toBe('-33')
        expect(fmtDelta(0)).toBe('0')
    })
})

describe('truncateText', () => {
    it('keeps text that fits', () => {
        expect(truncateText('Apple beats estimates', 21)).toBe('Apple beats estimates')
    })

    it('cuts longer text and appends an ellipsis', () => {
        expect(truncateText('Apple beats estimates', 5)).toBe('Apple…')
    })

    it('returns an empty string unchanged', () => {
        expect(truncateText('', 10)).toBe('')
    })
})
