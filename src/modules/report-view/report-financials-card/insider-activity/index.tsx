import { cn } from '@/lib/utils'
import type { InsiderActivity } from '@/types/ReportDTO'
import { getInsiderSignal, type SignalTone } from '@/_bff/core/helpers/financial-signals.helper'
import { fmtSignedCount } from '@/modules/report-view/report-financials-card/utils'

type Props = {
    insiders: InsiderActivity
}

const TONE_TEXT: Record<SignalTone, string> = {
    positive: 'text-positive',
    negative: 'text-destructive',
    neutral: 'text-ink',
}

const TONE_PILL: Record<SignalTone, string> = {
    positive: 'bg-positive/10 text-positive',
    negative: 'bg-destructive/10 text-destructive',
    neutral: 'bg-ink/8 text-ink/70',
}

export function InsiderActivitySummary({ insiders }: Props) {
    const { netShares } = insiders
    const signal = getInsiderSignal(netShares)

    return (
        <section data-testid="insider-activity" className="flex flex-col gap-4">
            <div className="border-b border-ink/10 pb-3">
                <h3 className="display text-xl">Insider activity</h3>
            </div>

            <div className="flex flex-1 flex-col gap-4 rounded-[var(--radius-surface-inner)] border border-ink/10 bg-paper p-4">
                <span className="flex flex-col gap-1">
                    <span className="eyebrow text-[11px] text-ink/60">Net shares traded</span>
                    <span className={cn('display text-4xl tabular-nums', TONE_TEXT[signal.tone])}>
                        {fmtSignedCount(netShares)}
                    </span>
                </span>

                <span
                    className={cn(
                        'w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold',
                        TONE_PILL[signal.tone]
                    )}
                >
                    {signal.label}
                </span>

                <p className="mt-auto flex flex-col gap-1 border-t border-ink/10 pt-3 text-xs leading-relaxed text-ink/60">
                    <span>Shares bought minus shares sold.</span>
                </p>
            </div>
        </section>
    )
}
