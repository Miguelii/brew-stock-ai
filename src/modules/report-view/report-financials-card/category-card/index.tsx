import { cn } from '@/lib/utils'
import type { MetricTile } from '@/modules/report-view/report-financials-card/types'
import { MetricRow } from '@/modules/report-view/report-financials-card/metric-row'
import {
    gradeCategory,
    gradeWord,
    qualityBgToken,
    qualityToken,
} from '@/modules/report-view/report-financials-card/metric-quality'

type Props = {
    title: string
    question: string
    metrics: MetricTile[]
}

export function CategoryCard({ title, question, metrics }: Props) {
    const grade = gradeCategory(metrics)

    return (
        <div className="flex flex-col rounded-none border border-border/60 bg-muted/30 p-4">
            <div className="mb-3 flex items-start justify-between gap-3 border-b border-border/60 pb-1.5">
                <div className="flex min-w-0 flex-col">
                    <span className="text-sm font-semibold text-primary">{title}</span>
                    <span className="text-xs text-muted-foreground">{question}</span>
                </div>
                {grade && (
                    <div
                        className={cn(
                            'flex min-w-12 shrink-0 flex-col items-center rounded px-3 py-1',
                            qualityBgToken(grade.quality)
                        )}
                    >
                        <span
                            className={cn(
                                'text-xl font-bold leading-none',
                                qualityToken(grade.quality)
                            )}
                        >
                            {grade.letter}
                        </span>
                        <span
                            className={cn('text-[10px] leading-tight', qualityToken(grade.quality))}
                        >
                            {gradeWord(grade.quality)}
                        </span>
                    </div>
                )}
            </div>
            <div className="flex flex-col">
                {metrics.map((m) => (
                    <MetricRow key={m.label} {...m} />
                ))}
            </div>
        </div>
    )
}
