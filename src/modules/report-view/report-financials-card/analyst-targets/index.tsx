import { cn } from '@/lib/utils'
import { fmtPrice } from '@/lib/formatters'
import type { StockFinancials } from '@/types/ReportDTO'

type Props = {
    financials: StockFinancials | null
}

export function AnalystTargets({ financials }: Props) {
    const f = financials

    const upside =
        f?.targetMeanPrice != null && f?.currentPrice != null && f.currentPrice > 0
            ? (((f.targetMeanPrice - f.currentPrice) / f.currentPrice) * 100).toFixed(1)
            : null

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    What analysts think the stock is worth
                </span>
                {upside !== null && (
                    <span
                        className={cn(
                            'text-xs font-semibold',
                            Number.parseFloat(upside) >= 0 ? 'text-positive' : 'text-destructive'
                        )}
                    >
                        {Number.parseFloat(upside) >= 0 ? '+' : ''}
                        {upside}% to consensus
                    </span>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="flex flex-col gap-1 p-3 bg-muted/40 rounded-sm">
                    <span className="text-[11px] leading-none text-muted-foreground">
                        Lowest analyst target
                    </span>
                    <span
                        className={cn(
                            'text-sm font-semibold leading-tight',
                            f?.targetLowPrice == null ? 'text-muted-foreground' : 'text-primary'
                        )}
                    >
                        {fmtPrice(f?.targetLowPrice)}
                    </span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-muted/40 rounded-sm">
                    <span className="text-[11px] leading-none text-muted-foreground">
                        Average analyst target
                    </span>
                    <span
                        className={cn(
                            'text-sm font-semibold leading-tight',
                            f?.targetMeanPrice == null ? 'text-muted-foreground' : 'text-primary'
                        )}
                    >
                        {fmtPrice(f?.targetMeanPrice)}
                    </span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-muted/40 rounded-sm">
                    <span className="text-[11px] leading-none text-muted-foreground">
                        Highest analyst target
                    </span>
                    <span
                        className={cn(
                            'text-sm font-semibold leading-tight',
                            f?.targetHighPrice == null ? 'text-muted-foreground' : 'text-primary'
                        )}
                    >
                        {fmtPrice(f?.targetHighPrice)}
                    </span>
                </div>
            </div>
        </div>
    )
}
