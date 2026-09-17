import type { StockFinancials, StockFundamentals } from '@/types/ReportDTO'
import type { MetricTile } from '@/types/MetricTile'
import { fmtLarge } from '@/_bff/core/utils/formatters.utils'
import {
    getGrowth,
    getHealth,
    getProfitability,
    getValuation,
} from '@/_bff/core/helpers/metric-builders.helper'

type Category = {
    id: string
    title: string
    question: string
    // Every metric, graded together; the section decides which ones it shows as tiles
    metrics: MetricTile[]
    tiles: MetricTile[]
    context: MetricTile[]
}

const splitMetrics = (metrics: MetricTile[]) => ({
    tiles: metrics.filter((m) => !m.context),
    context: metrics.filter((m) => m.context),
})

export const useFinancialCategories = (
    financials: StockFinancials | null,
    fundamentals: StockFundamentals | null
): Category[] => {
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
