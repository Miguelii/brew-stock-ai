import { describe, it, expect } from 'vitest'
import {
    compareWithSector,
    fmtDelta,
    gaugePoint,
    toScore100,
} from '@/modules/report-view/report-sector-scores/utils'

describe('toScore100', () => {
    it('scales and rounds Yahoo scores', () => {
        expect(toScore100(0.947)).toBe(95)
        expect(toScore100(0)).toBe(0)
    })

    it('keeps missing scores as null', () => {
        expect(toScore100(null)).toBeNull()
        // oxlint-disable-next-line unicorn/no-useless-undefined
        expect(toScore100(undefined)).toBeNull()
    })
})

describe('compareWithSector', () => {
    it('grades the gap to the sector average', () => {
        expect(compareWithSector(100, 50)).toEqual({
            delta: 50,
            verdict: 'Well above sector',
            tone: 'positive',
        })
        expect(compareWithSector(58, 50).verdict).toBe('Above sector')
        expect(compareWithSector(57, 50).verdict).toBe('In line with sector')
        expect(compareWithSector(43, 50).verdict).toBe('In line with sector')
        expect(compareWithSector(42, 50).verdict).toBe('Below sector')
        expect(compareWithSector(17, 50)).toEqual({
            delta: -33,
            verdict: 'Well below sector',
            tone: 'negative',
        })
    })
})

describe('fmtDelta', () => {
    it('signs positive gaps only', () => {
        expect(fmtDelta(45)).toBe('+45')
        expect(fmtDelta(-33)).toBe('-33')
        expect(fmtDelta(0)).toBe('0')
    })
})

describe('gaugePoint', () => {
    it('maps 0, 50 and 100 onto the half circle', () => {
        const left = gaugePoint(0, 50, 60, 60)
        const top = gaugePoint(50, 50, 60, 60)
        const right = gaugePoint(100, 50, 60, 60)

        expect(left.x).toBeCloseTo(10)
        expect(left.y).toBeCloseTo(60)
        expect(top.x).toBeCloseTo(60)
        expect(top.y).toBeCloseTo(10)
        expect(right.x).toBeCloseTo(110)
        expect(right.y).toBeCloseTo(60)
    })
})
