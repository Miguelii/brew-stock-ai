import { cn } from '@/lib/utils'
import { fmtDate, fmtNum, fmtPct } from '@/_bff/core/utils/formatters.utils'
import type { EarningsQuarter } from '@/types/ReportDTO'
import { getEarningsBeat } from '@/_bff/core/helpers/financial-signals.helper'

type Props = {
    history: EarningsQuarter[]
}

export function EarningsHistory({ history }: Props) {
    if (history.length === 0) return null

    const results = history.map((q) => ({ quarter: q, beat: getEarningsBeat(q) }))
    const graded = results.filter((r) => r.beat !== null)
    const beats = graded.filter((r) => r.beat).length

    return (
        <section data-testid="earnings-history" className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-4 border-b border-ink/10 pb-3">
                <h3 className="display text-xl">Earnings vs estimates</h3>
                {graded.length > 0 && (
                    <span className="text-sm text-ink/60">
                        Beat {beats} of {graded.length}
                    </span>
                )}
            </div>

            {/* flex-1 lets the row stretch to the insider card next to it, so both end level */}
            <ul className="grid flex-1 grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-3">
                {results.map(({ quarter: q, beat }) => (
                    <li
                        key={q.period}
                        className="flex flex-col gap-2 rounded-[var(--radius-surface-inner)] border border-ink/10 bg-paper p-4"
                    >
                        <span className="eyebrow text-[11px] text-ink/60">
                            {q.quarter ? fmtDate(q.quarter, 'short') : q.period}
                        </span>

                        <span className="flex flex-col gap-1">
                            <span
                                className={cn(
                                    'display text-4xl tabular-nums',
                                    q.epsActual == null ? 'text-ink/30' : 'text-ink'
                                )}
                            >
                                {fmtNum(q.epsActual)}
                            </span>
                            <span className="text-xs text-ink/60">
                                EPS · est. {fmtNum(q.epsEstimate)}
                            </span>
                        </span>

                        {beat != null && (
                            <span
                                className={cn(
                                    'mt-auto w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap',
                                    beat
                                        ? 'bg-positive/10 text-positive'
                                        : 'bg-destructive/10 text-destructive'
                                )}
                            >
                                {beat ? 'Beat' : 'Miss'} {fmtPct(q.surprisePercent)}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    )
}
