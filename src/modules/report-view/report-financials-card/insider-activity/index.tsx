import { cn } from '@/lib/utils'
import { fmtNum } from '@/_bff/core/utils/formatters.utils'
import type { InsiderActivity } from '@/types/ReportDTO'
import { getInsiderSignal, type SignalTone } from '@/_bff/core/helpers/financial-signals.helper'

type Props = {
    insiders: InsiderActivity
}

const TONE_CLASS: Record<SignalTone, string> = {
    positive: 'text-positive',
    negative: 'text-destructive',
    neutral: 'text-ink/60',
}

export function InsiderActivitySummary({ insiders }: Props) {
    const { buyCount, sellCount, netShares } = insiders

    const signal = getInsiderSignal(netShares)

    return (
        <div className="flex flex-col rounded-[var(--radius-surface-inner)] border border-ink/10 bg-paper p-4 gap-1.5">
            <span className="text-xs font-medium text-ink/60 uppercase tracking-wide">
                Insider activity
            </span>

            <div className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="text-xs text-ink/60">
                    {buyCount} buys / {sellCount} sells
                </span>
                <span
                    className={cn(
                        'text-xs font-semibold whitespace-nowrap',
                        TONE_CLASS[signal.tone]
                    )}
                >
                    {signal.label} ({fmtNum(netShares, 0)} shares)
                </span>
            </div>
        </div>
    )
}
