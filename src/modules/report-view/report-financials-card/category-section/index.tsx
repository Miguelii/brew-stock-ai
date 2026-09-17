import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { MetricTile } from '@/types/MetricTile'
import {
    gradeWord,
    qualityBgToken,
    qualityToken,
    type gradeCategory,
} from '@/_bff/core/helpers/metric-quality.helper'
import { MetricNumberTile } from '@/modules/report-view/report-financials-card/metric-number-tile'
import { categoryAnchor } from '@/modules/report-view/report-financials-card/utils'

type Props = {
    id: string
    title: string
    question: string
    grade: ReturnType<typeof gradeCategory>
    tiles: MetricTile[]
    context: MetricTile[]
    children?: ReactNode
}

export function CategorySection({ id, title, question, grade, tiles, context, children }: Props) {
    const anchor = categoryAnchor(id)

    return (
        <section
            id={anchor}
            aria-labelledby={`${anchor}-title`}
            className="flex scroll-mt-28 flex-col gap-4"
        >
            <div className="flex items-end justify-between gap-4 border-b border-ink/10 pb-3">
                <div className="flex min-w-0 flex-col gap-0.5">
                    <h3 id={`${anchor}-title`} className="display text-xl">
                        {title}
                    </h3>
                    <p className="text-sm text-ink/60">{question}</p>
                </div>

                {grade && (
                    <span
                        className={cn(
                            'flex shrink-0 items-baseline gap-1.5 rounded-full px-3 py-1',
                            qualityBgToken(grade.quality),
                            qualityToken(grade.quality)
                        )}
                    >
                        <span className="display text-xl">{grade.letter}</span>
                        <span className="text-xs font-semibold">{gradeWord(grade.quality)}</span>
                    </span>
                )}
            </div>

            {tiles.length > 0 && (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-3">
                    {tiles.map((metric) => (
                        <MetricNumberTile key={metric.label} metric={metric} />
                    ))}
                </div>
            )}

            {context.length > 0 && (
                <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                    {context.map(({ label, value }) => (
                        <div key={label} className="flex items-baseline gap-2">
                            <dt className="text-ink/60">{label}</dt>
                            <dd className="font-semibold text-ink tabular-nums">{value}</dd>
                        </div>
                    ))}
                </dl>
            )}

            {children}
        </section>
    )
}
