import { cn } from '@/lib/utils'
import { getScoreGaugeView } from '@/_bff/core/helpers/sector-scores.helper'

type Props = {
    value: number | null
    sector: number | null
}

export function ScoreGauge({ value, sector }: Props) {
    const { viewBox, arc, strokeWidth, valueDash, tick } = getScoreGaugeView(value, sector)

    return (
        <svg viewBox={viewBox} aria-hidden="true" className="w-full max-w-56">
            <path
                d={arc}
                pathLength={100}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={value === null ? '1.5 4' : undefined}
                className={cn(value === null ? 'text-ink/25' : 'text-ink/8')}
            />

            {valueDash && (
                <path
                    d={arc}
                    pathLength={100}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={valueDash}
                    className="text-blue"
                />
            )}

            {tick && (
                <line
                    {...tick}
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    className="text-ink"
                />
            )}
        </svg>
    )
}
