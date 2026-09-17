import type { ForwardEstimate } from '@/types/ReportDTO'
import { getForwardEstimateTiles } from '@/_bff/core/helpers/financial-categories.helper'
import { MetricNumberTile } from '@/modules/report-view/report-financials-card/metric-number-tile'

type Props = {
    estimates: ForwardEstimate[]
}

export function GrowthEstimates({ estimates }: Props) {
    const tiles = getForwardEstimateTiles(estimates)

    if (tiles.length === 0) return null

    return (
        <div className="flex flex-col gap-3">
            <span className="eyebrow text-xs text-ink/60">Analyst estimates</span>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-3">
                {tiles.map(({ key, metric, detail }) => (
                    <MetricNumberTile key={key} metric={metric} detail={detail} />
                ))}
            </div>
        </div>
    )
}
