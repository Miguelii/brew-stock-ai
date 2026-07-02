import type { GetYahooDataResult } from '@/_bff/modules/yahoo/types'
import type { StockFinancials, StockFundamentals, StockTechnicals } from '@/types/ReportDTO'
import type { NewsItem } from '@/types/news'
import { fmtNum, fmtPct, fmtLarge, fmtPrice, formatDate, pct1 } from '@/lib/formatters'

const NEWS_SUMMARY_MAX_CHARS = 200

/**
 * Render the "Key Financial Indicators" block (valuation, quality, growth and
 * analyst targets) as Markdown bullet lines. Dividend yield is included only
 * when present.
 *
 * @param f - The financial snapshot.
 * @returns The Markdown section as a single string.
 */
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

/**
 * Render the expanded fundamentals (earnings beats/misses, forward estimates,
 * multi-year revenue trend, analyst rating distribution, insider activity) as
 * Markdown. Each sub-block is emitted only when its data is present, so the
 * result is an empty string when no fundamentals are available.
 *
 * @param f - The expanded fundamentals.
 * @returns The Markdown section, or an empty string when there is nothing to show.
 */
function buildFundamentalsSection(f: StockFundamentals): string {
    const blocks: string[] = []

    if (f.earningsHistory.length > 0) {
        blocks.push(
            '**Earnings History (recent quarters, EPS actual vs estimate):**',
            ...f.earningsHistory.map((q) => {
                const result =
                    q.epsActual != null && q.epsEstimate != null
                        ? q.epsActual >= q.epsEstimate
                            ? 'beat'
                            : 'miss'
                        : 'n/a'
                const when = q.quarter ? ` (${q.quarter})` : ''
                return `- ${q.period}${when}: actual ${fmtNum(q.epsActual)} vs est. ${fmtNum(q.epsEstimate)} → ${result} (${fmtPct(q.surprisePercent)})`
            }),
            ''
        )
    }

    if (f.forwardEstimates.length > 0) {
        blocks.push(
            '**Forward Estimates (analyst consensus):**',
            ...f.forwardEstimates.map(
                (e) =>
                    `- ${e.period}: EPS est. ${fmtNum(e.epsAvg)} (growth ${fmtPct(e.epsGrowth)}) | Revenue est. ${fmtLarge(e.revenueAvg)} (growth ${fmtPct(e.revenueGrowth)})`
            ),
            ''
        )
    }

    if (f.revenueTrend.length > 0) {
        blocks.push(
            '**Revenue & Net Income Trend (annual):**',
            ...f.revenueTrend.map(
                (r) =>
                    `- ${r.endDate ?? 'N/A'}: Revenue ${fmtLarge(r.totalRevenue)} | Net Income ${fmtLarge(r.netIncome)}`
            ),
            ''
        )
    }

    if (f.analystRatings) {
        const r = f.analystRatings
        blocks.push(
            `**Analyst Rating Distribution (${r.period}):** Strong Buy ${r.strongBuy} | Buy ${r.buy} | Hold ${r.hold} | Sell ${r.sell} | Strong Sell ${r.strongSell}`,
            ''
        )
    }

    if (f.insiders) {
        const i = f.insiders
        const direction =
            i.netShares == null || i.netShares === 0
                ? 'roughly neutral'
                : i.netShares > 0
                  ? 'net buying'
                  : 'net selling'
        blocks.push(
            `**Insider Activity (recent):** ${i.buyCount} buys / ${i.sellCount} sells → ${direction} (${fmtNum(i.netShares, 0)} net shares)`,
            ''
        )
    }

    return blocks.join('\n')
}

/**
 * Render the technical snapshot (moving averages, trend regime, RSI, 52-week
 * position, trailing returns and volatility) as Markdown. Framed explicitly as
 * a secondary timing signal so the model does not let it lead the thesis.
 *
 * @param t - The computed technical indicators.
 * @returns The Markdown section as a single string.
 */
function buildTechnicalsSection(t: StockTechnicals): string {
    const trendLabel =
        t.trend === 'golden-cross'
            ? 'SMA50 above SMA200 (bullish regime)'
            : t.trend === 'death-cross'
              ? 'SMA50 below SMA200 (bearish regime)'
              : 'no clear SMA regime'

    return [
        '**Technical Snapshot (1-year daily, secondary timing signal):**',
        `- Price: ${fmtPrice(t.currentPrice)} | SMA50: ${fmtPrice(t.sma50)} (${pct1(t.priceVsSma50Pct)}) | SMA200: ${fmtPrice(t.sma200)} (${pct1(t.priceVsSma200Pct)})`,
        `- Trend: ${trendLabel}`,
        `- RSI(14): ${fmtNum(t.rsi14, 0)}`,
        `- 52w position: ${pct1(t.pctFrom52wHigh)} from high / ${pct1(t.pctFrom52wLow)} from low`,
        `- Returns: 1m ${pct1(t.return1m)} | 3m ${pct1(t.return3m)} | 6m ${pct1(t.return6m)} | 12m ${pct1(t.return12m)}`,
        `- Annualised volatility: ${pct1(t.annualizedVolatilityPct)}`,
        '',
    ].join('\n')
}

/**
 * Render recent headlines as Markdown, truncating each summary to
 * {@link NEWS_SUMMARY_MAX_CHARS}. Framed as a confirmatory signal only.
 *
 * @param news - The recent news items.
 * @returns The Markdown section as a single string.
 */
function buildNewsSection(news: NewsItem[]): string {
    return [
        '**Recent News (confirmatory signal only):**',
        ...news.map((n) => {
            const date = n.datetime ? ` (${formatDate(n.datetime)})` : ''
            const summary = n.summary
                ? ` — ${n.summary.slice(0, NEWS_SUMMARY_MAX_CHARS)}${n.summary.length > NEWS_SUMMARY_MAX_CHARS ? '…' : ''}`
                : ''
            return `- ${n.headline} [${n.source}]${date}${summary}`
        }),
        '',
    ].join('\n')
}

/**
 * Assemble the full "Current Market Context" block injected into the analysis
 * prompt. Sections render in descending order of weight — core financials and
 * fundamentals first, then the technical snapshot, Yahoo signals (significant
 * development, analyst coverage, company-vs-sector scores) and finally recent
 * news — and each is included only when its data is present.
 *
 * @param data - The Yahoo data (financials, fundamentals, sigDev, reports, scores).
 * @param technicals - Optional technical indicators; the snapshot is skipped when null or price-less.
 * @param news - Optional recent news items.
 * @returns The assembled Markdown context string.
 */
export function buildYahooContext(
    data: GetYahooDataResult,
    technicals?: StockTechnicals | null,
    news?: NewsItem[] | null
): string {
    const parts: string[] = [
        '## Current Market Context',
        'Live data from Yahoo Finance — incorporate these insights into your analysis where relevant.\n',
    ]

    if (data.financials) {
        parts.push(buildFinancialsSection(data.financials), '')
    }

    if (data.fundamentals) {
        const section = buildFundamentalsSection(data.fundamentals)
        if (section) parts.push(section)
    }

    if (technicals?.currentPrice != null) {
        parts.push(buildTechnicalsSection(technicals))
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

    if (news?.length) {
        parts.push('', buildNewsSection(news))
    }

    return parts.join('\n')
}
