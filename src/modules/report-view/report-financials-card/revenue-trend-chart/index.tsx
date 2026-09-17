import { cn } from '@/lib/utils'
import type { RevenueTrendPoint } from '@/types/ReportDTO'
import { fmtLarge } from '@/_bff/core/utils/formatters.utils'
import { evaluateMetric, qualityToken } from '@/_bff/core/helpers/metric-quality.helper'

type Props = {
    trend: RevenueTrendPoint[]
}

type ChartPoint = {
    year: string
    revenue: number
    netIncome: number | null
}

// The tallest bar stops short of the top so its value label still fits above it
const MAX_BAR_PCT = 82

export function RevenueTrendChart({ trend }: Props) {
    const points: ChartPoint[] = trend
        .flatMap((p) =>
            p.endDate && p.totalRevenue != null
                ? [{ year: p.endDate.slice(0, 4), revenue: p.totalRevenue, netIncome: p.netIncome }]
                : []
        )
        .toSorted((a, b) => a.year.localeCompare(b.year))

    if (points.length === 0) return null

    const maxRevenue = Math.max(...points.map((p) => p.revenue))

    return (
        <figure data-testid="revenue-trend-chart" className="flex flex-col gap-3">
            <figcaption className="eyebrow text-xs text-ink/60">
                Revenue and net income by year
            </figcaption>

            <ol className="flex gap-3 sm:gap-6">
                {points.map(({ year, revenue, netIncome }, i) => {
                    const barPct = maxRevenue > 0 ? (revenue / maxRevenue) * MAX_BAR_PCT : 0
                    const incomeQuality = evaluateMetric('netIncome', netIncome)?.quality

                    return (
                        <li key={year} className="flex min-w-0 flex-1 flex-col gap-2">
                            <span className="sr-only">
                                Revenue {year}: {fmtLarge(revenue)}. Net income {year}:{' '}
                                {fmtLarge(netIncome)}.
                            </span>

                            <span aria-hidden="true" className="relative block h-40">
                                <span
                                    className="absolute inset-x-0 text-center text-sm font-semibold text-ink tabular-nums"
                                    style={{ bottom: `calc(${barPct}% + 0.25rem)` }}
                                >
                                    {fmtLarge(revenue)}
                                </span>
                                <span
                                    className={cn(
                                        'absolute inset-x-0 bottom-0 rounded-t-[var(--radius-surface-inner)]',
                                        i === points.length - 1 ? 'bg-blue' : 'bg-blue/25'
                                    )}
                                    style={{ height: `${Math.max(barPct, 2)}%` }}
                                />
                            </span>

                            <span aria-hidden="true" className="flex flex-col items-center gap-0.5">
                                <span className="eyebrow text-xs text-ink">{year}</span>
                                <span
                                    className={cn(
                                        'text-xs tabular-nums',
                                        incomeQuality ? qualityToken(incomeQuality) : 'text-ink/60'
                                    )}
                                >
                                    Net {fmtLarge(netIncome)}
                                </span>
                            </span>
                        </li>
                    )
                })}
            </ol>
        </figure>
    )
}
