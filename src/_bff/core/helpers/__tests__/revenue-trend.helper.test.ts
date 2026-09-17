import { describe, it, expect } from 'vitest'
import { getRevenueChartPoints } from '@/_bff/core/helpers/revenue-trend.helper'

describe('getRevenueChartPoints', () => {
    it('sorts years, scales bars to the largest year and flags the latest', () => {
        const points = getRevenueChartPoints([
            { endDate: '2025-09-30', totalRevenue: 400, netIncome: 100 },
            { endDate: '2024-09-30', totalRevenue: 200, netIncome: -10 },
        ])

        expect(points).toEqual([
            {
                year: '2024',
                revenue: 200,
                netIncome: -10,
                barPct: 41,
                isLatest: false,
                incomeQuality: 'concern',
            },
            {
                year: '2025',
                revenue: 400,
                netIncome: 100,
                barPct: 82,
                isLatest: true,
                incomeQuality: 'good',
            },
        ])
    })

    it('skips years without a date or revenue and keeps a visible stub for tiny bars', () => {
        const points = getRevenueChartPoints([
            { endDate: null, totalRevenue: 100, netIncome: null },
            { endDate: '2023-12-31', totalRevenue: null, netIncome: 5 },
            { endDate: '2024-12-31', totalRevenue: 1, netIncome: null },
            { endDate: '2025-12-31', totalRevenue: 1000, netIncome: null },
        ])

        expect(points.map((p) => p.year)).toEqual(['2024', '2025'])
        expect(points[0]?.barPct).toBe(2)
        expect(points[0]?.incomeQuality).toBeNull()
    })

    it('returns no points for an empty trend', () => {
        expect(getRevenueChartPoints([])).toEqual([])
    })
})
