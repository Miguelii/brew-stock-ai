import type { ForwardEstimate, StockFinancials, StockFundamentals } from '@/types/ReportDTO'
import type { MetricTile } from '@/types/MetricTile'
import type { FinancialCategory } from '@/types/FinancialCategory'
import { fmtLarge, fmtNum, fmtSignedPct } from '@/_bff/core/utils/formatters.utils'
import { fmtEstimatePeriod } from '@/_bff/core/utils/metric-formatters.utils'
import {
    getGrowth,
    getHealth,
    getProfitability,
    getValuation,
} from '@/_bff/core/helpers/metric-builders.helper'

type EstimateTile = {
    key: string
    metric: MetricTile
    // Secondary line under the value, e.g. "+12.0% growth"
    detail: string | undefined
}

const splitMetrics = (metrics: MetricTile[]) => ({
    tiles: metrics.filter((m) => !m.context),
    context: metrics.filter((m) => m.context),
})

// The four graded categories of Key Financial Metrics, shared by the report page and the PDF
export function getFinancialCategories(
    financials: StockFinancials | null,
    fundamentals: StockFundamentals | null
): FinancialCategory[] {
    const valuation = getValuation(financials)
    const profitability = getProfitability(financials)
    const health = getHealth(financials)
    const growth = getGrowth(financials, fundamentals)

    return [
        {
            id: 'valuation',
            title: 'Valuation',
            question: 'Cheap or expensive?',
            metrics: valuation,
            ...splitMetrics(valuation),
        },
        {
            id: 'profitability',
            title: 'Profitability',
            question: 'Does it make good money?',
            metrics: profitability,
            ...splitMetrics(profitability),
        },
        {
            id: 'health',
            title: 'Financial Health',
            question: 'Can it cover its debts?',
            metrics: health,
            ...splitMetrics(health),
        },
        {
            id: 'growth',
            title: 'Growth',
            question: 'Is it growing?',
            metrics: growth,
            // Estimates and the yearly trend get their own blocks below the headline growth rates
            tiles: growth.filter(
                (m) => m.metricKey === 'revenueGrowth' || m.metricKey === 'earningsGrowth'
            ),
            context: [
                {
                    label: 'Total Revenue',
                    value: fmtLarge(financials?.totalRevenue),
                    context: true,
                },
            ],
        },
    ]
}

const growthDetail = (growth: number | null) =>
    growth != null ? `${fmtSignedPct(growth)} growth` : undefined

/** Analyst EPS and revenue estimates as tiles, two per forward period. */
export function getForwardEstimateTiles(estimates: ForwardEstimate[]): EstimateTile[] {
    return estimates.flatMap((e) => {
        const period = fmtEstimatePeriod(e.period)

        return [
            {
                key: `${e.period}-eps`,
                metric: {
                    label: `${period} EPS`,
                    value: fmtNum(e.epsAvg),
                    rawValue: e.epsGrowth,
                    metricKey: 'epsGrowth',
                },
                detail: growthDetail(e.epsGrowth),
            },
            {
                key: `${e.period}-revenue`,
                metric: {
                    label: `${period} Revenue`,
                    value: fmtLarge(e.revenueAvg),
                    rawValue: e.revenueGrowth,
                    metricKey: 'revenueGrowthFwd',
                },
                detail: growthDetail(e.revenueGrowth),
            },
        ]
    })
}
