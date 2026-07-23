import { cn } from '@/lib/utils'
import { fmtNum, fmtPct } from '@/lib/formatters'
import type { EarningsQuarter } from '@/types/ReportDTO'

type Props = {
    history: EarningsQuarter[]
}

export function EarningsHistory({ history }: Props) {
    if (history.length === 0) return null

    return (
        <div className="flex flex-col rounded-none border border-border/60 bg-muted/30 p-4 gap-1.5">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Earnings vs estimates
            </span>

            <div className="flex flex-col divide-y divide-border verflow-hidden">
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
                            <span className="text-xs text-muted-foreground">
                                {q.quarter ?? q.period}
                            </span>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-primary">
                                    <span className="text-muted-foreground">Act </span>
                                    {fmtNum(q.epsActual)}
                                    <span className="text-muted-foreground"> / Est </span>
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
