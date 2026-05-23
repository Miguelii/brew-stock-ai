import { cn } from '@/lib/utils'
import type { MetricTile } from '@/modules/report-view/report-financials-card/types'

const signColor = (n: number | null | undefined): string => {
    if (n == null) return ''
    return n >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-500'
}

export function Tile({ label, value, colored, rawValue }: MetricTile) {
    const isNA = value === 'N/A'
    const colorClass = colored && !isNA ? signColor(rawValue ?? null) : ''

    return (
        <div className="group flex flex-col gap-1 p-3 bg-muted/40 rounded-sm overflow-hidden">
            <span className="text-[11px] leading-none text-muted-foreground flex items-center gap-1">
                {label}
            </span>
            <span
                className={cn(
                    'text-sm font-semibold leading-tight transition-transform duration-300 group-hover:scale-[1.02] origin-left',
                    isNA ? 'text-muted-foreground' : colorClass || 'text-primary'
                )}
            >
                {value}
            </span>
        </div>
    )
}
