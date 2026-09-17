import { describe, it, expect } from 'vitest'
import {
    compareWithSector,
    gaugePoint,
    getScoreGaugeView,
    getSectorScores,
    toScore100,
} from '@/_bff/core/helpers/sector-scores.helper'

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

describe('getSectorScores', () => {
    it('builds one row per score with the sector comparison', () => {
        const rows = getSectorScores({
            company: { innovativeness: 0.85, hiring: null, sustainability: 0.17 },
            sector: { innovativeness: 0.5, hiring: 0.5, sustainability: 0.5 },
        })

        expect(rows.map((r) => [r.label, r.company, r.comparison?.verdict ?? null])).toEqual([
            ['Innovation', 85, 'Well above sector'],
            ['Workforce Growth', null, null],
            ['Sustainability', 17, 'Well below sector'],
        ])
    })

    it('returns rows without scores when there is no data', () => {
        expect(
            getSectorScores(null).every((r) => r.company === null && r.comparison === null)
        ).toBe(true)
    })
})

describe('getScoreGaugeView', () => {
    it('draws the company arc and a tick across the stroke at the sector average', () => {
        const view = getScoreGaugeView(85, 50)

        expect(view.valueDash).toBe('85 100')
        expect(view.tick?.x1).toBeCloseTo(60)
        expect(view.tick?.y1).toBeCloseTo(20)
        expect(view.tick?.y2).toBeCloseTo(0)
    })

    it('skips the arc for missing or zero scores and the tick without a sector average', () => {
        expect(getScoreGaugeView(null, 50).valueDash).toBeNull()
        expect(getScoreGaugeView(0, 50).valueDash).toBeNull()
        expect(getScoreGaugeView(40, null).tick).toBeNull()
    })
})
