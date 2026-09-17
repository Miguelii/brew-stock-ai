import { cn } from '@/lib/utils'
import type { MetricTile } from '@/types/MetricTile'
import {
    getMetricRowState,
    qualityBgToken,
    qualityToken,
    type MetricTone,
} from '@/_bff/core/helpers/metric-quality.helper'

type Props = {
    metric: MetricTile
    detail?: string
}

const pillClass = (tone: MetricTone): string =>
    tone === 'na' || tone === 'plain'
        ? 'bg-ink/8 text-ink/70'
        : cn(qualityBgToken(tone), qualityToken(tone))

export function MetricNumberTile({ metric, detail }: Props) {
    const { help, verdict, tone } = getMetricRowState(metric)

    return (
        <div
            data-testid="metric-tile"
            className="flex flex-col gap-3 rounded-[var(--radius-surface-inner)] border border-ink/10 bg-paper p-4"
        >
            <span className="flex flex-col gap-0.5">
                <span className="eyebrow text-[11px] text-ink/60">{metric.label}</span>
                {help && <span className="text-xs leading-snug text-ink/45">{help}</span>}
            </span>

            <span className="mt-auto flex flex-col gap-1">
                <span
                    className={cn(
                        'display text-4xl tabular-nums',
                        tone === 'na' ? 'text-ink/30' : 'text-ink'
                    )}
                >
                    {metric.value}
                </span>
                {detail && <span className="text-xs text-ink/60">{detail}</span>}
            </span>

            {verdict && (
                <span
                    className={cn(
                        'w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold',
                        pillClass(tone)
                    )}
                >
                    {verdict}
                </span>
            )}
        </div>
    )
}
