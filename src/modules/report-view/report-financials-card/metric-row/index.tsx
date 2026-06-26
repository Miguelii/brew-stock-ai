import { cn } from '@/lib/utils'
import type { MetricTile } from '@/modules/report-view/report-financials-card/types'
import {
    evaluateMetric,
    metricHelp,
    qualityToken,
} from '@/modules/report-view/report-financials-card/metric-quality'

export function MetricRow({ label, value, rawValue, metricKey, helper, context }: MetricTile) {
    const isNA = value === 'N/A'
    const evaluation = context || isNA ? null : evaluateMetric(metricKey, rawValue ?? null)
    const help = context ? undefined : (helper ?? metricHelp(metricKey))

    const hasEvaluation = evaluation && evaluation.verdict !== 'N/A'

    const getColor = () => {
        if (isNA) return 'text-muted-foreground'
        if (!evaluation) return 'text-primary'
        return qualityToken(evaluation.quality)
    }

    return (
        <div className="flex items-start justify-between gap-3 border-t border-border/60 py-2 first:border-t-0 first:pt-0">
            <div className="flex min-w-0 flex-col gap-1">
                <span className="text-[13px] leading-tight text-muted-foreground">{label}</span>
                {help && (
                    <span className="text-[10px] leading-tight text-muted-foreground/70">
                        {help}
                    </span>
                )}
            </div>
            <div className="flex shrink-0 flex-col items-end text-right gap-1">
                <span className={cn('text-[13px] font-semibold leading-tight', getColor())}>
                    {value}
                </span>
                {hasEvaluation && (
                    <span className={cn('text-[10px] font-medium leading-none', getColor())}>
                        {evaluation.verdict}
                    </span>
                )}
            </div>
        </div>
    )
}
