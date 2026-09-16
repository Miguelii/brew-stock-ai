import { cn } from '@/lib/utils'
import { fmtPrice, signedPct1 } from '@/_bff/core/utils/formatters.utils'
import type { StockFinancials } from '@/types/ReportDTO'
import { getTargetUpsidePct } from '@/_bff/core/helpers/financial-signals.helper'

type Props = {
    financials: StockFinancials | null
}

export function AnalystTargets({ financials }: Props) {
    const f = financials

    const upside = getTargetUpsidePct(f)

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
                <span className="text-xs font-medium text-ink/60 uppercase tracking-wide">
                    What analysts think the stock is worth
                </span>
                {upside !== null && (
                    <span
                        className={cn(
                            'text-xs font-semibold',
                            upside >= 0 ? 'text-positive' : 'text-destructive'
                        )}
                    >
                        {signedPct1(upside)} to consensus
                    </span>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="flex flex-col gap-1 p-3 bg-paper rounded-[var(--radius-surface-inner)]">
                    <span className="text-xs leading-none text-ink/60">Lowest analyst target</span>
                    <span
                        className={cn(
                            'text-sm font-semibold leading-tight',
                            f?.targetLowPrice == null ? 'text-ink/60' : 'text-ink'
                        )}
                    >
                        {fmtPrice(f?.targetLowPrice)}
                    </span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-paper rounded-[var(--radius-surface-inner)]">
                    <span className="text-xs leading-none text-ink/60">Average analyst target</span>
                    <span
                        className={cn(
                            'text-sm font-semibold leading-tight',
                            f?.targetMeanPrice == null ? 'text-ink/60' : 'text-ink'
                        )}
                    >
                        {fmtPrice(f?.targetMeanPrice)}
                    </span>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-paper rounded-[var(--radius-surface-inner)]">
                    <span className="text-xs leading-none text-ink/60">Highest analyst target</span>
                    <span
                        className={cn(
                            'text-sm font-semibold leading-tight',
                            f?.targetHighPrice == null ? 'text-ink/60' : 'text-ink'
                        )}
                    >
                        {fmtPrice(f?.targetHighPrice)}
                    </span>
                </div>
            </div>
        </div>
    )
}
