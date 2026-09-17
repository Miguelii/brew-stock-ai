'use client'

import { getSentimentGaugeView } from '@/_bff/core/helpers/sentiment-gauge.helper'

interface Props {
    score: number // 0–100
    isRiskAnalysis?: boolean
}

export function SentimentGauge({ score, isRiskAnalysis = false }: Props) {
    const { viewBox, segments, needle, pivot, activeLabel, activeColor, disclaimer } =
        getSentimentGaugeView(score, isRiskAnalysis)

    return (
        <div className="flex flex-col items-center gap-2">
            <svg viewBox={viewBox} className="w-full max-w-64">
                {segments.map((seg) => (
                    <g key={seg.key}>
                        <path d={seg.path} fill={seg.color} />

                        <g transform={seg.labelTransform}>
                            <text
                                textAnchor="middle"
                                fontSize={seg.fontSize}
                                fontWeight="700"
                                letterSpacing="0.2"
                                fill="white"
                            >
                                {seg.lines.length === 1 ? (
                                    <tspan x="0" dy="2">
                                        {seg.lines[0]}
                                    </tspan>
                                ) : (
                                    <>
                                        <tspan x="0" dy="-1.5">
                                            {seg.lines[0]}
                                        </tspan>
                                        <tspan x="0" dy="6">
                                            {seg.lines[1]}
                                        </tspan>
                                    </>
                                )}
                            </text>
                        </g>
                    </g>
                ))}

                <line
                    {...needle}
                    stroke="var(--muted-foreground)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />
                <circle {...pivot} fill="var(--muted-foreground)" />
            </svg>

            <p className="text-sm font-bold tracking-wide" style={{ color: activeColor }}>
                {activeLabel}
            </p>

            <p className="mt-1 w-full text-center text-xs leading-relaxed text-ink/60">
                {disclaimer}
            </p>
        </div>
    )
}
