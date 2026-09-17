import type { StockScores } from '@/types/ReportDTO'
import type { SectorComparison, SectorScore } from '@/types/SectorScore'
import {
    SECTOR_SCORE_CLEAR_GAP,
    SECTOR_SCORE_ROWS,
    SECTOR_SCORE_WIDE_GAP,
} from '@/_bff/core/constants/sector-scores.constants'

type ScoreGaugeView = {
    viewBox: string
    arc: string
    strokeWidth: number
    // Dash pattern for the company arc, or null when there is no score to draw
    valueDash: string | null
    tick: { x1: number; y1: number; x2: number; y2: number } | null
}

const GAUGE_CX = 60
const GAUGE_CY = 58
const GAUGE_RADIUS = 48
const GAUGE_STROKE = 10

// Shared by the report page gauges and the exported PDF.

/** Yahoo's 0 to 1 score on a 0 to 100 scale, or null when missing. */
export const toScore100 = (n: number | null | undefined): number | null =>
    n == null ? null : Math.round(n * 100)

export function compareWithSector(company: number, sector: number): SectorComparison {
    const delta = company - sector

    if (delta >= SECTOR_SCORE_WIDE_GAP) {
        return { delta, verdict: 'Well above sector', tone: 'positive' }
    }
    if (delta >= SECTOR_SCORE_CLEAR_GAP) return { delta, verdict: 'Above sector', tone: 'positive' }
    if (delta > -SECTOR_SCORE_CLEAR_GAP) {
        return { delta, verdict: 'In line with sector', tone: 'neutral' }
    }
    if (delta > -SECTOR_SCORE_WIDE_GAP) {
        return { delta, verdict: 'Below sector', tone: 'negative' }
    }

    return { delta, verdict: 'Well below sector', tone: 'negative' }
}

export const getSectorScores = (scores: StockScores | null | undefined): SectorScore[] =>
    SECTOR_SCORE_ROWS.map(({ key, label, description }) => {
        const company = toScore100(scores?.company?.[key])
        const sector = toScore100(scores?.sector?.[key])

        return {
            label,
            description,
            company,
            sector,
            comparison:
                company !== null && sector !== null ? compareWithSector(company, sector) : null,
        }
    })

/** A point on a gauge's upper half circle for a 0 to 100 value (0 on the left, 100 on the right). */
export function gaugePoint(value: number, radius: number, cx: number, cy: number) {
    const angle = Math.PI - (value / 100) * Math.PI

    return { x: cx + radius * Math.cos(angle), y: cy - radius * Math.sin(angle) }
}

/** Geometry of the sector score half gauge; the arc is drawn with pathLength=100. */
export function getScoreGaugeView(value: number | null, sector: number | null): ScoreGaugeView {
    const inner =
        sector !== null ? gaugePoint(sector, GAUGE_RADIUS - GAUGE_STROKE, GAUGE_CX, GAUGE_CY) : null
    const outer =
        sector !== null ? gaugePoint(sector, GAUGE_RADIUS + GAUGE_STROKE, GAUGE_CX, GAUGE_CY) : null

    return {
        viewBox: '0 0 120 70',
        arc: `M ${GAUGE_CX - GAUGE_RADIUS} ${GAUGE_CY} A ${GAUGE_RADIUS} ${GAUGE_RADIUS} 0 0 1 ${GAUGE_CX + GAUGE_RADIUS} ${GAUGE_CY}`,
        strokeWidth: GAUGE_STROKE,
        valueDash: value !== null && value > 0 ? `${value} 100` : null,
        tick: inner && outer ? { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y } : null,
    }
}
