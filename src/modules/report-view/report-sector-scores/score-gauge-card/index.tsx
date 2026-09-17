import { cn } from '@/lib/utils'
import type { SignalTone } from '@/_bff/core/helpers/financial-signals.helper'
import type { SectorScore } from '@/types/SectorScore'
import { ScoreGauge } from '@/modules/report-view/report-sector-scores/score-gauge'
import { fmtDelta } from '@/_bff/core/utils/formatters.utils'

type Props = {
    score: SectorScore
}

const TONE_PILL: Record<SignalTone, string> = {
    positive: 'bg-positive/10 text-positive',
    negative: 'bg-destructive/10 text-destructive',
    neutral: 'bg-ink/8 text-ink/70',
}

const TONE_TEXT: Record<SignalTone, string> = {
    positive: 'text-positive',
    negative: 'text-destructive',
    neutral: 'text-ink/60',
}

export function ScoreGaugeCard({ score }: Props) {
    const { label, description, company, sector, comparison } = score

    return (
        <div
            data-testid="sector-score-card"
            className="flex h-full flex-col items-center gap-3 rounded-[var(--radius-surface-inner)] border border-ink/10 bg-paper p-5 text-center"
        >
            <span className="flex flex-col gap-1">
                <span className="eyebrow text-xs text-ink">{label}</span>
                <span className="text-xs leading-snug text-ink/60">{description}</span>
            </span>

            <span aria-hidden="true" className="relative mt-auto flex w-full justify-center">
                <ScoreGauge value={company} sector={sector} />
                <span
                    data-testid="sector-score-value"
                    className={cn(
                        'display absolute bottom-0 tabular-nums',
                        company === null ? 'text-3xl text-ink/30' : 'text-5xl text-ink'
                    )}
                >
                    {company ?? 'N/A'}
                </span>
            </span>
            <span className="sr-only">
                {company === null
                    ? `${label}: no score available`
                    : `${label}: ${company} out of 100${sector === null ? '' : `, sector average ${sector}`}`}
            </span>

            {comparison ? (
                <span className="flex flex-col items-center gap-1.5">
                    <span
                        data-testid="sector-score-verdict"
                        className={cn(
                            'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                            TONE_PILL[comparison.tone]
                        )}
                    >
                        {comparison.verdict}
                    </span>
                    <span className="text-xs text-ink/60 tabular-nums">
                        <span className={cn('font-semibold', TONE_TEXT[comparison.tone])}>
                            {fmtDelta(comparison.delta)}
                        </span>{' '}
                        vs sector average ({sector})
                    </span>
                </span>
            ) : (
                <span className="rounded-full bg-ink/8 px-2.5 py-0.5 text-xs font-semibold text-ink/60">
                    {company === null ? 'No data' : 'No sector average'}
                </span>
            )}
        </div>
    )
}
