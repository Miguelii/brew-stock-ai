import { gaugePoint } from '@/modules/report-view/report-sector-scores/utils'

type Props = {
    value: number | null
    sector: number | null
}

const CX = 60
const CY = 58
const RADIUS = 48
const STROKE = 10
const ARC = `M ${CX - RADIUS} ${CY} A ${RADIUS} ${RADIUS} 0 0 1 ${CX + RADIUS} ${CY}`

export function ScoreGauge({ value, sector }: Props) {
    const tickInner = sector !== null ? gaugePoint(sector, RADIUS - STROKE, CX, CY) : null
    const tickOuter = sector !== null ? gaugePoint(sector, RADIUS + STROKE, CX, CY) : null

    return (
        <svg viewBox="0 0 120 70" aria-hidden="true" className="w-full max-w-56">
            <path
                d={ARC}
                pathLength={100}
                fill="none"
                stroke="currentColor"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={value === null ? '1.5 4' : undefined}
                className={value === null ? 'text-ink/25' : 'text-ink/8'}
            />

            {value !== null && value > 0 && (
                <path
                    d={ARC}
                    pathLength={100}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={STROKE}
                    strokeLinecap="round"
                    strokeDasharray={`${value} 100`}
                    className="text-blue"
                />
            )}

            {tickInner && tickOuter && (
                <line
                    x1={tickInner.x}
                    y1={tickInner.y}
                    x2={tickOuter.x}
                    y2={tickOuter.y}
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    className="text-ink"
                />
            )}
        </svg>
    )
}
