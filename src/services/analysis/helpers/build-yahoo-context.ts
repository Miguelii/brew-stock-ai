import type { GetYahooDataResult, StockFinancials } from '@/services/analysis/types'

function fmt(v: number | null | undefined): string {
    return v != null ? v.toFixed(2) : 'N/A'
}

function fmtPct(v: number | null | undefined): string {
    return v != null ? `${(v * 100).toFixed(1)}%` : 'N/A'
}

function fmtLarge(v: number | null | undefined): string {
    if (v == null) return 'N/A'
    const abs = Math.abs(v)
    if (abs >= 1e12) return `$${(v / 1e12).toFixed(2)}T`
    if (abs >= 1e9) return `$${(v / 1e9).toFixed(2)}B`
    if (abs >= 1e6) return `$${(v / 1e6).toFixed(1)}M`
    return `$${v.toLocaleString()}`
}

function fmtPrice(v: number | null | undefined): string {
    return v != null ? `$${v.toFixed(2)}` : 'N/A'
}

function buildFinancialsSection(f: StockFinancials): string {
    const lines = [
        '**Key Financial Indicators:**',
        `- Price: ${fmtPrice(f.currentPrice)} | 52w Range: ${fmtPrice(f.fiftyTwoWeekLow)}–${fmtPrice(f.fiftyTwoWeekHigh)} | Beta: ${fmt(f.beta)}`,
        `- Market Cap: ${fmtLarge(f.marketCap)} | Enterprise Value: ${fmtLarge(f.enterpriseValue)}`,
        `- P/E (TTM): ${fmt(f.trailingPE)} | Forward P/E: ${fmt(f.forwardPE)} | P/B: ${fmt(f.priceToBook)}`,
        `- Revenue Growth (YoY): ${fmtPct(f.revenueGrowth)} | Earnings Growth: ${fmtPct(f.earningsGrowth)}`,
        `- Profit Margin: ${fmtPct(f.profitMargins)} | Operating Margin: ${fmtPct(f.operatingMargins)}`,
        `- ROE: ${fmtPct(f.returnOnEquity)} | Debt-to-Equity: ${fmt(f.debtToEquity)}`,
        `- Free Cash Flow: ${fmtLarge(f.freeCashflow)} | Operating Cash Flow: ${fmtLarge(f.operatingCashflow)}`,
        `- EBITDA: ${fmtLarge(f.ebitda)} | Total Revenue: ${fmtLarge(f.totalRevenue)}`,
    ]

    if (f.dividendYield != null) {
        lines.push(`- Dividend Yield: ${fmtPct(f.dividendYield)}`)
    }

    lines.push(
        `- Analyst Target: ${fmtPrice(f.targetLowPrice)} (low) / ${fmtPrice(f.targetMeanPrice)} (mean) / ${fmtPrice(f.targetHighPrice)} (high)`
    )

    return lines.join('\n')
}

export function buildYahooContext(data: GetYahooDataResult): string {
    const parts: string[] = [
        '## Current Market Context',
        'Live data from Yahoo Finance — incorporate these insights into your analysis where relevant.\n',
    ]

    if (data.financials) {
        parts.push(buildFinancialsSection(data.financials), '')
    }

    if (data.sigDev?.headline) {
        const date = data.sigDev.date ? ` (${data.sigDev.date})` : ''
        parts.push(`**Recent Significant Development:** ${data.sigDev.headline}${date}\n`)
    }

    if (data.reports?.length) {
        parts.push(
            '**Latest News:**',
            ...data.reports.map((r) => {
                const title = r.title ?? r.reportTitle ?? ''
                const source = r.provider ?? ''
                const date = r.reportDate ? ` (${r.reportDate})` : ''
                return `- ${title} — ${source}${date}`
            }),
            ''
        )
    }

    if (data.scores) {
        const { company, sector } = data.scores
        parts.push(
            '**Company vs Sector Scores (0.0–1.0 scale):**',
            `- Innovation: ${fmt(company.innovativeness)} (sector avg: ${fmt(sector.innovativeness)})`,
            `- Hiring Velocity: ${fmt(company.hiring)} (sector avg: ${fmt(sector.hiring)})`,
            `- Sustainability: ${fmt(company.sustainability)} (sector avg: ${fmt(sector.sustainability)})`
        )
    }

    return parts.join('\n')
}
