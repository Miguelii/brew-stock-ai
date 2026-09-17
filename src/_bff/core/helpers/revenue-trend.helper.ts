import type { RevenueTrendPoint } from '@/types/ReportDTO'
import { evaluateMetric, type MetricQuality } from '@/_bff/core/helpers/metric-quality.helper'

type RevenueChartPoint = {
    year: string
    revenue: number
    netIncome: number | null
    // Bar height as a percentage of the plot area
    barPct: number
    isLatest: boolean
    incomeQuality: MetricQuality | null
}

// The tallest bar stops short of the top so its value label still fits above it
const MAX_BAR_PCT = 82
const MIN_BAR_PCT = 2

/** Yearly revenue bars, oldest first, scaled to the largest year. Years without revenue are skipped. */
export function getRevenueChartPoints(trend: RevenueTrendPoint[]): RevenueChartPoint[] {
    const points = trend
        .flatMap((p) =>
            p.endDate && p.totalRevenue != null
                ? [{ year: p.endDate.slice(0, 4), revenue: p.totalRevenue, netIncome: p.netIncome }]
                : []
        )
        .toSorted((a, b) => a.year.localeCompare(b.year))

    const maxRevenue = Math.max(0, ...points.map((p) => p.revenue))

    return points.map((p, i) => ({
        ...p,
        barPct:
            maxRevenue > 0
                ? Math.max((p.revenue / maxRevenue) * MAX_BAR_PCT, MIN_BAR_PCT)
                : MIN_BAR_PCT,
        isLatest: i === points.length - 1,
        incomeQuality: evaluateMetric('netIncome', p.netIncome)?.quality ?? null,
    }))
}
