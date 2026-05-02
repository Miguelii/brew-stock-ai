import type { GetYahooDataResult } from './get-yahoo-data'

function fmt(v: number | null | undefined): string {
    return v != null ? v.toFixed(2) : 'N/A'
}

export function buildYahooContext(data: GetYahooDataResult): string {
    const parts: string[] = [
        '## Current Market Context',
        'Live data from Yahoo Finance — incorporate these insights into your analysis where relevant.\n',
    ]

    if (data.sigDev?.headline) {
        const date = data.sigDev.date ? ` (${data.sigDev.date})` : ''
        parts.push(`**Recent Significant Development:** ${data.sigDev.headline}${date}\n`)
    }

    if (data.reports?.length) {
        parts.push('**Latest News:**')
        for (const r of data.reports) {
            const title = r.title ?? r.reportTitle ?? ''
            const source = r.provider ?? ''
            const date = r.reportDate ? ` (${r.reportDate})` : ''
            parts.push(`- ${title} — ${source}${date}`)
        }
        parts.push('')
    }

    if (data.scores) {
        const { company, sector } = data.scores
        parts.push('**Company vs Sector Scores (0.0–1.0 scale):**')
        parts.push(
            `- Innovation: ${fmt(company.innovativeness)} (sector avg: ${fmt(sector.innovativeness)})`
        )
        parts.push(`- Hiring Velocity: ${fmt(company.hiring)} (sector avg: ${fmt(sector.hiring)})`)
        parts.push(
            `- Sustainability: ${fmt(company.sustainability)} (sector avg: ${fmt(sector.sustainability)})`
        )
    }

    return parts.join('\n')
}
