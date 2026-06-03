import type { GetYahooDataResult } from '@/services/yahoo/types'
import type { StockFinancials } from '@/types/ReportDTO'
import { fmtNum, fmtPct, fmtLarge, fmtPrice } from '@/lib/formatters'

function buildFinancialsSection(f: StockFinancials): string {
    const lines = [
        '**Key Financial Indicators:**',
        `- Price: ${fmtPrice(f.currentPrice)} | 52w Range: ${fmtPrice(f.fiftyTwoWeekLow)}–${fmtPrice(f.fiftyTwoWeekHigh)} | Beta: ${fmtNum(f.beta)}`,
        `- Market Cap: ${fmtLarge(f.marketCap)} | Enterprise Value: ${fmtLarge(f.enterpriseValue)}`,
        `- P/E (TTM): ${fmtNum(f.trailingPE)} | Forward P/E: ${fmtNum(f.forwardPE)} | P/B: ${fmtNum(f.priceToBook)}`,
        `- Revenue Growth (YoY): ${fmtPct(f.revenueGrowth)} | Earnings Growth: ${fmtPct(f.earningsGrowth)}`,
        `- Profit Margin: ${fmtPct(f.profitMargins)} | Operating Margin: ${fmtPct(f.operatingMargins)}`,
        `- ROE: ${fmtPct(f.returnOnEquity)} | Debt-to-Equity: ${fmtNum(f.debtToEquity)}`,
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
            '**Analyst Coverage:**',
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
            `- Innovation: ${fmtNum(company.innovativeness)} (sector avg: ${fmtNum(sector.innovativeness)})`,
            `- Hiring Velocity: ${fmtNum(company.hiring)} (sector avg: ${fmtNum(sector.hiring)})`,
            `- Sustainability: ${fmtNum(company.sustainability)} (sector avg: ${fmtNum(sector.sustainability)})`
        )
    }

    return parts.join('\n')
}
