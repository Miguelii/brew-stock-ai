import { cn } from '@/lib/utils'
import {
    gradeWord,
    qualityToken,
    type gradeCategory,
    type MetricQuality,
} from '@/_bff/core/helpers/metric-quality.helper'
import { categoryAnchor } from '@/modules/report-view/report-financials-card/utils'

type ScoreBoardItem = {
    id: string
    title: string
    grade: ReturnType<typeof gradeCategory>
}

type Props = {
    items: ScoreBoardItem[]
}

const QUALITY_FILL: Record<MetricQuality, string> = {
    good: 'bg-positive',
    neutral: 'bg-ink/40',
    caution: 'bg-warning',
    concern: 'bg-destructive',
}

export function ScoreBoard({ items }: Props) {
    return (
        <ul data-testid="key-metrics-scoreboard" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {items.map(({ id, title, grade }) => (
                <li key={id} data-testid="key-metrics-score">
                    <a
                        href={`#${categoryAnchor(id)}`}
                        className="group flex h-full flex-col gap-3 rounded-[var(--radius-surface-inner)] bg-paper p-4 outline-offset-2 focus-visible:outline-2 focus-visible:outline-blue"
                    >
                        <span className="eyebrow text-[11px] text-ink/60 transition-colors duration-200 group-hover:text-blue">
                            {title}
                        </span>

                        <span className="flex items-baseline gap-2">
                            <span
                                className={cn(
                                    'display text-5xl',
                                    grade ? qualityToken(grade.quality) : 'text-ink/30'
                                )}
                            >
                                {grade?.letter ?? 'N/A'}
                            </span>
                            <span className="text-sm font-semibold text-ink/70">
                                {grade ? gradeWord(grade.quality) : 'No data'}
                            </span>
                        </span>

                        {grade && (
                            <span className="mt-auto flex items-center gap-2">
                                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/8">
                                    <span
                                        className={cn(
                                            'block h-full rounded-full',
                                            QUALITY_FILL[grade.quality]
                                        )}
                                        style={{ width: `${grade.score}%` }}
                                    />
                                </span>
                                <span className="text-xs text-ink/60 tabular-nums">
                                    {Math.round(grade.score)}
                                </span>
                            </span>
                        )}
                    </a>
                </li>
            ))}
        </ul>
    )
}
