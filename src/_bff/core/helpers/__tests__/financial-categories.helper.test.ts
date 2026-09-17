import { describe, it, expect } from 'vitest'
import type { StockFinancials } from '@/types/ReportDTO'
import {
    getFinancialCategories,
    getForwardEstimateTiles,
} from '@/_bff/core/helpers/financial-categories.helper'

describe('getFinancialCategories', () => {
    it('returns the four categories in page order', () => {
        expect(getFinancialCategories(null, null).map((c) => c.id)).toEqual([
            'valuation',
            'profitability',
            'health',
            'growth',
        ])
    })

    it('splits context rows away from the graded tiles', () => {
        const [valuation] = getFinancialCategories(null, null)

        expect(valuation?.tiles.every((m) => !m.context)).toBe(true)
        expect(valuation?.context.map((m) => m.label)).toEqual([
            'Company Value',
            'Total Value incl. Debt',
        ])
    })

    it('keeps only the headline growth rates as growth tiles', () => {
        const financials = { totalRevenue: 394_328_000_000 } as StockFinancials
        const growth = getFinancialCategories(financials, null).at(-1)

        expect(growth?.tiles.map((m) => m.metricKey)).toEqual(['revenueGrowth', 'earningsGrowth'])
        expect(growth?.context).toEqual([
            { label: 'Total Revenue', value: '$394.33B', context: true },
        ])
    })
})

describe('getForwardEstimateTiles', () => {
    it('builds an EPS and a revenue tile per period with the growth detail', () => {
        const tiles = getForwardEstimateTiles([
            {
                period: '+1q',
                epsAvg: 2.35,
                epsGrowth: 0.12,
                revenueAvg: 124e9,
                revenueGrowth: null,
            },
        ])

        expect(tiles).toEqual([
            {
                key: '+1q-eps',
                metric: {
                    label: 'Next Quarter EPS',
                    value: '2.35',
                    rawValue: 0.12,
                    metricKey: 'epsGrowth',
                },
                detail: '+12.0% growth',
            },
            {
                key: '+1q-revenue',
                metric: {
                    label: 'Next Quarter Revenue',
                    value: '$124.00B',
                    rawValue: null,
                    metricKey: 'revenueGrowthFwd',
                },
                detail: undefined,
            },
        ])
    })
})
