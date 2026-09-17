import {
    RISK_DISCLAIMER,
    RISK_GAUGE_SEGMENTS,
    SENTIMENT_DISCLAIMER,
    SENTIMENT_GAUGE_SEGMENTS,
} from '@/_bff/core/constants/sentiment.constants'
import { getSentimentInfo } from '@/_bff/core/helpers/sentiment.helper'

type Point = { x: number; y: number }

type GaugeSegmentView = {
    key: number
    path: string
    color: string
    lines: readonly string[]
    fontSize: number
    // Places the label at the segment's middle, rotated to follow the arc
    labelTransform: string
}

type SentimentGaugeView = {
    viewBox: string
    segments: GaugeSegmentView[]
    needle: { x1: number; y1: number; x2: string; y2: string }
    pivot: { cx: number; cy: number; r: number }
    activeLabel: string
    activeColor: string
    disclaimer: string
}

const CX = 100
const CY = 100
const R_OUT = 88
const R_IN = 52
const R_MID = (R_OUT + R_IN) / 2
const NEEDLE_LEN = 62
const NEEDLE_BASE_R = 5
// Degrees trimmed from each shared boundary so segments read as separate blocks
const GAP = 0.5

/** Maps score 0–100 to an angle in degrees: 0 → 180° (left), 100 → 0° (right). */
const scoreToAngle = (score: number) => 180 * (1 - score / 100)

function pt(r: number, deg: number): Point {
    const rad = (deg * Math.PI) / 180
    return { x: CX + r * Math.cos(rad), y: CY - r * Math.sin(rad) }
}

const fmt = (n: number) => n.toFixed(2)

/** Donut sector path from fromDeg → toDeg (fromDeg > toDeg, i.e. left → right). */
function arcPath(fromDeg: number, toDeg: number): string {
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

// Everything the sentiment gauge draws, shared by the report page (JSX) and the PDF (SVG string)
export function getSentimentGaugeView(score: number, isRiskAnalysis = false): SentimentGaugeView {
    const clamped = Math.min(100, Math.max(0, score))
    const { label, color } = getSentimentInfo(clamped)
    const segments = isRiskAnalysis ? RISK_GAUGE_SEGMENTS : SENTIMENT_GAUGE_SEGMENTS

    const needleAngle = Math.PI * (1 - clamped / 100)

    return {
        viewBox: '0 0 200 108',
        segments: segments.map((seg, i) => {
            const startAngle = i === 0 ? 180 : scoreToAngle(seg.startScore) - GAP
            const endAngle = i === segments.length - 1 ? 0 : scoreToAngle(seg.endScore) + GAP
            const midAngle = (startAngle + endAngle) / 2
            const textPt = pt(R_MID, midAngle)

            return {
                key: seg.startScore,
                path: arcPath(startAngle, endAngle),
                color: seg.color,
                lines: seg.lines,
                fontSize: seg.lines.length > 1 ? 4.5 : 5,
                labelTransform: `translate(${fmt(textPt.x)}, ${fmt(textPt.y)}) rotate(${(-(midAngle - 90)).toFixed(1)})`,
            }
        }),
        needle: {
            x1: CX,
            y1: CY,
            x2: fmt(CX + NEEDLE_LEN * Math.cos(needleAngle)),
            y2: fmt(CY - NEEDLE_LEN * Math.sin(needleAngle)),
        },
        pivot: { cx: CX, cy: CY, r: NEEDLE_BASE_R },
        activeLabel: isRiskAnalysis
            ? (RISK_GAUGE_SEGMENTS.find(
                  (s) => clamped >= s.startScore && clamped <= s.endScore
              )?.lines.join(' ') ?? label.toUpperCase())
            : label.toUpperCase(),
        activeColor: color,
        disclaimer: isRiskAnalysis ? RISK_DISCLAIMER : SENTIMENT_DISCLAIMER,
    }
}
