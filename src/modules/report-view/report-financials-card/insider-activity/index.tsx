import { cn } from '@/lib/utils'
import { fmtNum } from '@/lib/formatters'
import type { InsiderActivity } from '@/types/ReportDTO'

type Props = {
    insiders: InsiderActivity
}

export function InsiderActivitySummary({ insiders }: Props) {
    const { buyCount, sellCount, netShares } = insiders

    const isNeutral = netShares == null || netShares === 0
    const direction = isNeutral ? 'Roughly neutral' : netShares > 0 ? 'Net buying' : 'Net selling'
    const tone = isNeutral
        ? 'text-muted-foreground'
        : netShares > 0
          ? 'text-positive'
          : 'text-destructive'

    return (
        <div className="flex flex-col rounded-md border border-border/60 bg-muted/30 p-4 gap-1.5">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Insider activity
            </span>

            <div className="flex items-center justify-between gap-2 px-3 py-2 bg-muted/40 rounded-sm">
                <span className="text-xs text-muted-foreground">
                    {buyCount} buys / {sellCount} sells
                </span>
                <span className={cn('text-xs font-semibold whitespace-nowrap', tone)}>
                    {direction} ({fmtNum(netShares, 0)} shares)
                </span>
            </div>
        </div>
    )
}
