'use client'

const CX = 100
const CY = 100
const R_OUT = 78
const R_IN = 56
const NEEDLE_LEN = 68
const NEEDLE_BASE_R = 5
const STEPS = 90 // 2° per segment → smooth gradient

function pt(r: number, deg: number) {
    const rad = (deg * Math.PI) / 180
    return { x: CX + r * Math.cos(rad), y: CY - r * Math.sin(rad) }
}

function fmt(n: number) {
    return n.toFixed(2)
}

function donutSector(fromDeg: number, toDeg: number) {
    const o1 = pt(R_OUT, fromDeg)
    const o2 = pt(R_OUT, toDeg)
    const i2 = pt(R_IN, toDeg)
    const i1 = pt(R_IN, fromDeg)
    const span = Math.abs(fromDeg - toDeg)
    const large = span > 180 ? 1 : 0
    return [
        `M ${fmt(o1.x)} ${fmt(o1.y)}`,
        `A ${R_OUT} ${R_OUT} 0 ${large} 1 ${fmt(o2.x)} ${fmt(o2.y)}`,
        `L ${fmt(i2.x)} ${fmt(i2.y)}`,
        `A ${R_IN} ${R_IN} 0 ${large} 0 ${fmt(i1.x)} ${fmt(i1.y)}`,
        'Z',
    ].join(' ')
}

/** Interpolate hue 0 (red) → 120 (green) through yellow, matching the image. */
function segmentColor(step: number) {
    const hue = (step / STEPS) * 120
    return `hsl(${hue.toFixed(1)}, 88%, 52%)`
}

interface Props {
    score: number // 0–100
}

export function SentimentGauge({ score }: Props) {
    const clamped = Math.min(100, Math.max(0, score))

    // Needle: score 0 → 180° (left), score 100 → 0° (right)
    const needleAngleRad = Math.PI * (1 - clamped / 100)
    const needleX = CX + NEEDLE_LEN * Math.cos(needleAngleRad)
    const needleY = CY - NEEDLE_LEN * Math.sin(needleAngleRad)

    return (
        <div className="flex flex-col items-center gap-1">
            <svg viewBox="0 0 200 104" className="w-full max-w-60">
                {/* Gradient arc — 90 × 2° segments blended red→yellow→green */}
                {Array.from({ length: STEPS }, (_, i) => {
                    const fromDeg = 180 - (i / STEPS) * 179
                    const toDeg = 180 - ((i + 1) / STEPS) * 179
                    return <path key={i} d={donutSector(fromDeg, toDeg)} fill={segmentColor(i)} />
                })}

                {/* Needle */}
                <line
                    x1={CX}
                    y1={CY}
                    x2={fmt(needleX)}
                    y2={fmt(needleY)}
                    stroke="var(--muted-foreground)"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                />

                {/* Pivot */}
                <circle cx={CX} cy={CY} r={NEEDLE_BASE_R} fill="var(--muted-foreground)" />
            </svg>

            <div className="mt-6 flex w-full max-w-60 justify-between px-3 text-xs font-semibold tracking-wide">
                <span className="text-red-500">BEARISH</span>
                <span className="text-yellow-500">NEUTRAL</span>
                <span className="text-green-500">BULLISH</span>
            </div>

            <p className="mt-3 w-full text-center text-[10px] leading-relaxed text-muted-foreground">
                This score reflects the sentiment inferred from the AI analysis only and does not
                constitute financial advice or an investment recommendation.
            </p>
        </div>
    )
}
