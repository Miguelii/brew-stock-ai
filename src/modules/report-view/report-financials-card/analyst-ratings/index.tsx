import { cn } from '@/lib/utils'
import { ANALYST_RATING_SEGMENTS } from '@/_bff/core/constants/analyst-ratings.constants'
import type { AnalystRatings } from '@/types/ReportDTO'
import { getAnalystRatingsTotal } from '@/_bff/core/helpers/financial-signals.helper'

type Props = {
    ratings: AnalystRatings
}

type RatingKey = (typeof ANALYST_RATING_SEGMENTS)[number]['key']

const SEGMENT_COLOR: Record<RatingKey, string> = {
    strongBuy: 'bg-positive',
    buy: 'bg-positive/60',
    hold: 'bg-ink/30',
    sell: 'bg-destructive/60',
    strongSell: 'bg-destructive',
}

export function AnalystRatingsBar({ ratings }: Props) {
    const total = getAnalystRatingsTotal(ratings)

    if (total === 0) return null

    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-ink/60 uppercase tracking-wide">
                Analyst recommendations ({total})
            </span>

            <div className="flex h-2.5 w-full overflow-hidden rounded bg-ink/8">
                {ANALYST_RATING_SEGMENTS.map((s) => {
                    const count = ratings[s.key]
                    if (count === 0) return null
                    return (
                        <div
                            key={s.key}
                            className={cn(SEGMENT_COLOR[s.key])}
                            style={{ width: `${(count / total) * 100}%` }}
                        />
                    )
                })}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {ANALYST_RATING_SEGMENTS.map((s) => (
                    <div key={s.key} className="flex items-center gap-1.5">
                        <span
                            className={cn('size-2 rounded-full shrink-0', SEGMENT_COLOR[s.key])}
                        />
                        <span className="text-xs text-ink/60">{s.label}</span>
                        <span className="text-xs font-semibold text-ink">{ratings[s.key]}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
