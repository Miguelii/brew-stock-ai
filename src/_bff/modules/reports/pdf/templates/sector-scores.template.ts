import { fmtDelta } from '@/_bff/core/utils/formatters.utils'
import { getScoreGaugeView, getSectorScores } from '@/_bff/core/helpers/sector-scores.helper'
import type { StockScores } from '@/types/ReportDTO'
import type { SectorScore } from '@/types/SectorScore'
import { PDF_COLORS, SIGNAL_BG_HEX, SIGNAL_HEX } from '@/_bff/modules/reports/pdf/constants'
import { escapeHtml } from '@/_bff/modules/reports/pdf/helpers/escape-html.helper'
import { sectionTemplate } from '@/_bff/modules/reports/pdf/templates/section.template'

function scoreGaugeTemplate(company: number | null, sector: number | null): string {
    const { viewBox, arc, strokeWidth, valueDash, tick } = getScoreGaugeView(company, sector)

    const track =
        company === null
            ? `<path d="${arc}" pathLength="100" fill="none" stroke="${PDF_COLORS.faint}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-dasharray="1.5 4" />`
            : `<path d="${arc}" pathLength="100" fill="none" stroke="${PDF_COLORS.track}" stroke-width="${strokeWidth}" stroke-linecap="round" />`

    const value = valueDash
        ? `<path d="${arc}" pathLength="100" fill="none" stroke="${PDF_COLORS.blue}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-dasharray="${valueDash}" />`
        : ''

    const tickLine = tick
        ? `<line x1="${tick.x1.toFixed(2)}" y1="${tick.y1.toFixed(2)}" x2="${tick.x2.toFixed(2)}" y2="${tick.y2.toFixed(2)}" stroke="${PDF_COLORS.ink}" stroke-width="2.5" stroke-linecap="round" />`
        : ''

    return `<svg class="score-gauge" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">${track}${value}${tickLine}</svg>`
}

function scoreCardTemplate({
    label,
    description,
    company,
    sector,
    comparison,
}: SectorScore): string {
    const verdict = comparison
        ? `
            <span class="pill" style="margin-top:8px;background:${SIGNAL_BG_HEX[comparison.tone]};color:${SIGNAL_HEX[comparison.tone]};">${comparison.verdict}</span>
            <div class="score-delta"><strong style="color:${comparison.tone === 'neutral' ? PDF_COLORS.muted : SIGNAL_HEX[comparison.tone]};">${fmtDelta(comparison.delta)}</strong> vs sector average (${sector})</div>`
        : `<span class="pill" style="margin-top:8px;background:${SIGNAL_BG_HEX.neutral};color:${PDF_COLORS.muted};">${company === null ? 'No data' : 'No sector average'}</span>`

    return `
        <div class="tile score-card">
            <div class="eyebrow" style="color:${PDF_COLORS.ink};">${escapeHtml(label)}</div>
            <div class="score-description">${escapeHtml(description)}</div>
            <div class="score-gauge-wrap">
                ${scoreGaugeTemplate(company, sector)}
                <span class="display score-value" style="color:${company === null ? PDF_COLORS.faint : PDF_COLORS.ink};${company === null ? 'font-size:22px;' : ''}">${company ?? 'N/A'}</span>
            </div>
            ${verdict}
        </div>`
}

const LEGEND = `
    <div class="legend">
        <span><span class="legend-mark" style="width:16px;height:5px;border-radius:999px;background:${PDF_COLORS.blue};"></span>This company</span>
        <span><span class="legend-mark" style="width:2px;height:11px;background:${PDF_COLORS.ink};"></span>Sector average</span>
        <span><span class="legend-mark" style="width:16px;border-top:2px dashed ${PDF_COLORS.faint};"></span>Data not available</span>
    </div>`

/** "How It Compares": company vs sector scores as half gauges. Empty when there are no scores. */
export function sectorScoresTemplate(scores: StockScores | null | undefined): string {
    if (!scores) return ''

    return sectionTemplate({
        title: 'How It Compares',
        subtitle: 'How this company scores against the rest of its sector, from 0 to 100',
        body: `
        <div class="grid-3">${getSectorScores(scores)
            .map((score) => scoreCardTemplate(score))
            .join('')}</div>
        ${LEGEND}`,
    })
}
