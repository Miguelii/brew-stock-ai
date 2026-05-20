import { cn } from '@/lib/utils'
import type { MetricTile } from '@/modules/report-view/report-financials-card/types'
import { Tile } from '@/modules/report-view/report-financials-card/title'

type Props = {
    title: string
    tiles: MetricTile[]
    cols?: 3 | 4
}

export function Group({ title, tiles, cols = 4 }: Props) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {title}
            </span>
            <div
                className={cn(
                    'grid gap-2',
                    cols === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'
                )}
            >
                {tiles.map((t) => (
                    <Tile key={t.label} {...t} />
                ))}
            </div>
        </div>
    )
}
