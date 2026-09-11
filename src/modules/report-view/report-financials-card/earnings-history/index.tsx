import { cn } from '@/lib/utils'
import { fmtNum, fmtPct } from '@/lib/formatters'
import type { EarningsQuarter } from '@/types/ReportDTO'

type Props = {
    history: EarningsQuarter[]
}

export function EarningsHistory({ history }: Props) {
    if (history.length === 0) return null

    return (
        <div className="flex flex-col rounded-[var(--radius-surface-inner)] border border-ink/10 bg-paper p-4 gap-1.5">
            <span className="text-xs font-medium text-ink/60 uppercase tracking-wide">
                Earnings vs estimates
            </span>

            <div className="flex flex-col divide-y divide-ink/10 verflow-hidden">
                {history.map((q) => {
                    const beat =
                        q.epsActual != null && q.epsEstimate != null
                            ? q.epsActual >= q.epsEstimate
                            : null

                    return (
                        <div
                            key={q.period}
                            className="flex items-center justify-between gap-2 px-3 py-2"
                        >
                            <span className="text-xs text-ink/60">{q.quarter ?? q.period}</span>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-ink">
                                    <span className="text-ink/60">Act </span>
                                    {fmtNum(q.epsActual)}
                                    <span className="text-ink/60"> / Est </span>
                                    {fmtNum(q.epsEstimate)}
                                </span>
                                {beat != null && (
                                    <span
                                        className={cn(
                                            'text-xs font-semibold whitespace-nowrap',
                                            beat ? 'text-positive' : 'text-destructive'
                                        )}
                                    >
                                        {beat ? 'Beat' : 'Miss'} {fmtPct(q.surprisePercent)}
                                    </span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
