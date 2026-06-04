import { cn } from '@/lib/utils'
import type { AnalystRatings } from '@/types/ReportDTO'

type Props = {
    ratings: AnalystRatings
}

const SEGMENTS = [
    { key: 'strongBuy', label: 'Strong Buy', color: 'bg-positive' },
    { key: 'buy', label: 'Buy', color: 'bg-positive/60' },
    { key: 'hold', label: 'Hold', color: 'bg-muted-foreground/40' },
    { key: 'sell', label: 'Sell', color: 'bg-destructive/60' },
    { key: 'strongSell', label: 'Strong Sell', color: 'bg-destructive' },
] as const

export function AnalystRatingsBar({ ratings }: Props) {
    const total = ratings.strongBuy + ratings.buy + ratings.hold + ratings.sell + ratings.strongSell

    if (total === 0) return null

    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Analyst recommendations ({total})
            </span>

            <div className="flex h-2.5 w-full overflow-hidden rounded-sm bg-muted">
                {SEGMENTS.map((s) => {
                    const count = ratings[s.key]
                    if (count === 0) return null
                    return (
                        <div
                            key={s.key}
                            className={cn(s.color)}
                            style={{ width: `${(count / total) * 100}%` }}
                        />
                    )
                })}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {SEGMENTS.map((s) => (
                    <div key={s.key} className="flex items-center gap-1.5">
                        <span className={cn('size-2 rounded-full shrink-0', s.color)} />
                        <span className="text-[11px] text-muted-foreground">{s.label}</span>
                        <span className="text-[11px] font-semibold text-primary">
                            {ratings[s.key]}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
