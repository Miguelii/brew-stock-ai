import type { SignalTone } from '@/_bff/core/helpers/financial-signals.helper'

type SectorComparison = {
    delta: number
    verdict: string
    tone: SignalTone
}

// Point gaps (on the 0 to 100 scale) that separate "in line" from "above" and "well above"
const CLEAR_GAP = 8
const WIDE_GAP = 25

/** Yahoo's 0 to 1 score on a 0 to 100 scale, or null when missing. */
export const toScore100 = (n: number | null | undefined): number | null =>
    n == null ? null : Math.round(n * 100)

export function compareWithSector(company: number, sector: number): SectorComparison {
    const delta = company - sector

    if (delta >= WIDE_GAP) return { delta, verdict: 'Well above sector', tone: 'positive' }
    if (delta >= CLEAR_GAP) return { delta, verdict: 'Above sector', tone: 'positive' }
    if (delta > -CLEAR_GAP) return { delta, verdict: 'In line with sector', tone: 'neutral' }
    if (delta > -WIDE_GAP) return { delta, verdict: 'Below sector', tone: 'negative' }

    return { delta, verdict: 'Well below sector', tone: 'negative' }
}

export const fmtDelta = (delta: number): string => (delta > 0 ? `+${delta}` : `${delta}`)

/** A point on the gauge's upper half circle for a 0 to 100 value (0 on the left, 100 on the right). */
export function gaugePoint(value: number, radius: number, cx: number, cy: number) {
    const angle = Math.PI - (value / 100) * Math.PI

    return { x: cx + radius * Math.cos(angle), y: cy - radius * Math.sin(angle) }
}
