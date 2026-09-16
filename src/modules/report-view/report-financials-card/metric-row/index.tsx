import { cn } from '@/lib/utils'
import type { MetricTile } from '@/types/MetricTile'
import {
    getMetricRowState,
    qualityToken,
    type MetricTone,
} from '@/_bff/core/helpers/metric-quality.helper'

type Props = MetricTile

const toneClass = (tone: MetricTone): string => {
    if (tone === 'na') return 'text-ink/60'
    if (tone === 'plain') return 'text-ink'
    return qualityToken(tone)
}

export function MetricRow(metric: Props) {
    const { label, value } = metric
    const { help, verdict, tone } = getMetricRowState(metric)

    return (
        <div className="flex items-start justify-between gap-3 border-t border-ink/10 py-2 first:border-t-0 first:pt-0">
            <div className="flex min-w-0 flex-col gap-1">
                <span className="text-md leading-tight text-ink/60">{label}</span>
                {help && <span className="text-xs leading-tight text-ink/45">{help}</span>}
            </div>
            <div className="flex shrink-0 flex-col items-end text-right gap-1">
                <span className={cn('text-md font-semibold leading-tight', toneClass(tone))}>
                    {value}
                </span>
                {verdict != null && (
                    <span className={cn('text-xs font-medium leading-none', toneClass(tone))}>
                        {verdict}
                    </span>
                )}
            </div>
        </div>
    )
}
