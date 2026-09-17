import type { ForwardEstimate } from '@/types/ReportDTO'
import { fmtLarge, fmtNum } from '@/_bff/core/utils/formatters.utils'
import { fmtEstimatePeriod } from '@/_bff/core/utils/metric-formatters.utils'
import { MetricNumberTile } from '@/modules/report-view/report-financials-card/metric-number-tile'
import { fmtSignedPct } from '@/modules/report-view/report-financials-card/utils'

type Props = {
    estimates: ForwardEstimate[]
}

export function GrowthEstimates({ estimates }: Props) {
    if (estimates.length === 0) return null

    return (
        <div className="flex flex-col gap-3">
            <span className="eyebrow text-xs text-ink/60">Analyst estimates</span>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-3">
                {estimates.flatMap((e) => {
                    const period = fmtEstimatePeriod(e.period)

                    return [
                        <MetricNumberTile
                            key={`${e.period}-eps`}
                            metric={{
                                label: `${period} EPS`,
                                value: fmtNum(e.epsAvg),
                                rawValue: e.epsGrowth,
                                metricKey: 'epsGrowth',
                            }}
                            detail={
                                e.epsGrowth != null
                                    ? `${fmtSignedPct(e.epsGrowth)} growth`
                                    : undefined
                            }
                        />,
                        <MetricNumberTile
                            key={`${e.period}-revenue`}
                            metric={{
                                label: `${period} Revenue`,
                                value: fmtLarge(e.revenueAvg),
                                rawValue: e.revenueGrowth,
                                metricKey: 'revenueGrowthFwd',
                            }}
                            detail={
                                e.revenueGrowth != null
                                    ? `${fmtSignedPct(e.revenueGrowth)} growth`
                                    : undefined
                            }
                        />,
                    ]
                })}
            </div>
        </div>
    )
}
