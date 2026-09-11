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
    const tone = isNeutral ? 'text-ink/60' : netShares > 0 ? 'text-positive' : 'text-destructive'

    return (
        <div className="flex flex-col rounded-[var(--radius-surface-inner)] border border-ink/10 bg-paper p-4 gap-1.5">
            <span className="text-xs font-medium text-ink/60 uppercase tracking-wide">
                Insider activity
            </span>

            <div className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="text-xs text-ink/60">
                    {buyCount} buys / {sellCount} sells
                </span>
                <span className={cn('text-xs font-semibold whitespace-nowrap', tone)}>
                    {direction} ({fmtNum(netShares, 0)} shares)
                </span>
            </div>
        </div>
    )
}
