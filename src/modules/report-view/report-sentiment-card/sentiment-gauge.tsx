'use client'

import {
    BEARISH_COLOR,
    BULLISH_COLOR,
    EXTREME_BEARISH_COLOR,
    EXTREME_BULLISH_COLOR,
    getSentimentInfo,
    NEUTRAL_COLOR,
} from '@/modules/report-view/sentiment'

const CX = 100
const CY = 100
const R_OUT = 88
const R_IN = 52
const R_MID = (R_OUT + R_IN) / 2 // 70
const NEEDLE_LEN = 62
const NEEDLE_BASE_R = 5
const GAP = 0.5

interface SegmentDef {
    startScore: number
    endScore: number
    color: string
    lines: string[]
}

const SEGMENTS: SegmentDef[] = [
    { startScore: 0, endScore: 24, color: EXTREME_BEARISH_COLOR, lines: ['EXTREME', 'BEARISH'] },
    { startScore: 25, endScore: 42, color: BEARISH_COLOR, lines: ['BEARISH'] },
    { startScore: 43, endScore: 57, color: NEUTRAL_COLOR, lines: ['NEUTRAL'] },
    { startScore: 58, endScore: 75, color: BULLISH_COLOR, lines: ['BULLISH'] },
    { startScore: 76, endScore: 100, color: EXTREME_BULLISH_COLOR, lines: ['EXTREME', 'BULLISH'] },
]

const RISK_SEGMENTS: SegmentDef[] = [
    { startScore: 0, endScore: 24, color: EXTREME_BEARISH_COLOR, lines: ['VERY HIGH', 'RISK'] },
    { startScore: 25, endScore: 42, color: BEARISH_COLOR, lines: ['HIGH RISK'] },
    { startScore: 43, endScore: 57, color: NEUTRAL_COLOR, lines: ['MODERATE', 'RISK'] },
    { startScore: 58, endScore: 75, color: BULLISH_COLOR, lines: ['LOW RISK'] },
    { startScore: 76, endScore: 100, color: EXTREME_BULLISH_COLOR, lines: ['VERY LOW', 'RISK'] },
]

/** Maps score 0–100 to an angle in degrees: 0 → 180° (left), 100 → 0° (right). */
function scoreToAngle(score: number) {
    return 180 * (1 - score / 100)
}

function pt(r: number, deg: number) {
    const rad = (deg * Math.PI) / 180
    return { x: CX + r * Math.cos(rad), y: CY - r * Math.sin(rad) }
}

function fmt(n: number) {
    return n.toFixed(2)
}

/** Donut sector path from fromDeg → toDeg (fromDeg > toDeg, i.e. left → right). */
function arcPath(fromDeg: number, toDeg: number) {
    const o1 = pt(R_OUT, fromDeg)
    const o2 = pt(R_OUT, toDeg)
    const i2 = pt(R_IN, toDeg)
    const i1 = pt(R_IN, fromDeg)
    const large = Math.abs(fromDeg - toDeg) > 180 ? 1 : 0
    return [
        `M ${fmt(o1.x)} ${fmt(o1.y)}`,
        `A ${R_OUT} ${R_OUT} 0 ${large} 1 ${fmt(o2.x)} ${fmt(o2.y)}`,
        `L ${fmt(i2.x)} ${fmt(i2.y)}`,
        `A ${R_IN} ${R_IN} 0 ${large} 0 ${fmt(i1.x)} ${fmt(i1.y)}`,
        'Z',
    ].join(' ')
}

interface Props {
    score: number // 0–100
    isRiskAnalysis?: boolean
}

export function SentimentGauge({ score, isRiskAnalysis = false }: Props) {
    const clamped = Math.min(100, Math.max(0, score))
    const { label, color } = getSentimentInfo(clamped)
    const segments = isRiskAnalysis ? RISK_SEGMENTS : SEGMENTS

    const needleAngleRad = Math.PI * (1 - clamped / 100)
    const needleX = CX + NEEDLE_LEN * Math.cos(needleAngleRad)
    const needleY = CY - NEEDLE_LEN * Math.sin(needleAngleRad)

    return (
        <div className="flex flex-col items-center gap-2">
            <svg viewBox="0 0 200 108" className="w-full max-w-64">
                {segments.map((seg, i) => {
                    // Apply half-gap inward on each shared boundary (none on the outer edges)
                    const startAngle = i === 0 ? 180 : scoreToAngle(seg.startScore) - GAP
                    const endAngle =
                        i === SEGMENTS.length - 1 ? 0 : scoreToAngle(seg.endScore) + GAP

                    // Text sits at mid-radius, mid-angle of the segment
                    const midAngle = (startAngle + endAngle) / 2
                    const textPt = pt(R_MID, midAngle)

                    // Rotate text so it follows the curvature (perpendicular to radius)
                    const rotation = -(midAngle - 90)

                    return (
                        <g key={seg.startScore}>
                            {/* Segment arc — always coloured */}
                            <path d={arcPath(startAngle, endAngle)} fill={seg.color} />

                            {/* Label — translated to mid-point then rotated along the arc */}
                            <g
                                transform={`translate(${fmt(textPt.x)}, ${fmt(textPt.y)}) rotate(${rotation.toFixed(1)})`}
                            >
                                <text
                                    textAnchor="middle"
                                    fontSize={seg.lines.length > 1 ? '4.5' : '5'}
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
                    )
                })}

                {/* Needle */}
                <line
                    x1={CX}
                    y1={CY}
                    x2={fmt(needleX)}
                    y2={fmt(needleY)}
                    stroke="var(--muted-foreground)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />

                {/* Pivot */}
                <circle cx={CX} cy={CY} r={NEEDLE_BASE_R} fill="var(--muted-foreground)" />
            </svg>

            {/* Active label */}
            <p className="text-sm font-bold tracking-wide" style={{ color }}>
                {isRiskAnalysis
                    ? (RISK_SEGMENTS.find(
                          (s) => clamped >= s.startScore && clamped <= s.endScore
                      )?.lines.join(' ') ?? label.toUpperCase())
                    : label.toUpperCase()}
            </p>

            <p className="mt-1 w-full text-center text-xs leading-relaxed text-muted-foreground">
                {isRiskAnalysis
                    ? 'This score reflects the risk level inferred from the Engine analysis only and does not constitute financial advice.'
                    : 'This score reflects the sentiment inferred from the Engine analysis only and does not constitute financial advice or an investment recommendation.'}
            </p>
        </div>
    )
}
