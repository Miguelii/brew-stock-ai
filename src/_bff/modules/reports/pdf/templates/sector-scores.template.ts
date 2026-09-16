import { fmtNum } from '@/_bff/core/utils/formatters.utils'
import { SECTOR_SCORE_ROWS } from '@/_bff/core/constants/sector-scores.constants'
import type { StockScores } from '@/types/ReportDTO'
import { PDF_COLORS } from '@/_bff/modules/reports/pdf/constants'
import { sectionTemplate } from '@/_bff/modules/reports/pdf/templates/section.template'

// Yahoo's snapshot types allow undefined as well as null, so both mean "no score"
type ScoreRowInput = {
    label: string
    company: number | null | undefined
    sector: number | null | undefined
}

/** One score as a bar filled to the company value, with a tick at the sector average. */
function scoreRowTemplate({ label, company, sector }: ScoreRowInput): string {
    const bar =
        company == null
            ? `<div style="position:absolute;inset:0;background:${PDF_COLORS.track};border-radius:4px;"></div>`
            : `<div style="position:absolute;top:0;bottom:0;left:0;width:${(company * 100).toFixed(1)}%;background:${PDF_COLORS.blue};border-radius:4px;"></div>`

    const tick =
        sector == null
            ? ''
            : `<div style="position:absolute;top:0;bottom:0;left:${(sector * 100).toFixed(1)}%;width:2px;background:${PDF_COLORS.tick};z-index:1;"></div>`

    const value =
        company == null
            ? `<span style="color:${PDF_COLORS.muted};">N/A</span>`
            : `<span style="font-weight:600;">${fmtNum(company)}</span>`

    const track = company == null ? PDF_COLORS.background : PDF_COLORS.track

    return `
            <div style="margin-bottom:16px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:12px;">
                    <span style="font-weight:600;">${label}</span>
                    <span>${value}<span style="color:${PDF_COLORS.muted};font-weight:400;"> vs ${fmtNum(sector)}</span></span>
                </div>
                <div style="position:relative;height:10px;background:${track};border-radius:4px;overflow:hidden;">
                    ${bar}${tick}
                </div>
            </div>`
}

/** "How It Compares": company vs sector soft scores. Empty when there are no scores. */
export function sectorScoresTemplate(scores: StockScores | null | undefined): string {
    if (!scores) return ''

    const rows = SECTOR_SCORE_ROWS.map(({ key, label }) =>
        scoreRowTemplate({ label, company: scores.company[key], sector: scores.sector[key] })
    ).join('')

    return sectionTemplate({
        title: 'How It Compares',
        subtitle:
            'How this company stacks up against others in the same sector (scale 0–1, higher is better)',
        body: rows,
    })
}
