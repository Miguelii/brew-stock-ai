import type { GetYahooDataResult } from '@/_bff/modules/yahoo/types'
import type { ForwardEstimate, StockFundamentals, StockTechnicals } from '@/types/ReportDTO'
import type { NewsItem } from '@/types/news'
import { fmtNum, fmtPct, fmtLarge, fmtPrice, formatDate } from '@/_bff/core/utils/formatters.utils'
import { hasAny, NEWS_SUMMARY_MAX_CHARS, pct1 } from './utils.helper'
import {
    buildFinancialsSection,
    buildPositioningSection,
} from '@/_bff/modules/yahoo/helpers/build-financials-section.helper'

/**
 * How the EPS consensus moved: revision counts over the last 30 days and the estimate
 * 30/90 days ago. Empty when the revisions were not captured.
 *
 * @param e - A forward estimate row.
 * @returns The Markdown suffix appended to the estimate line.
 */
function buildRevisionSuffix(e: ForwardEstimate): string {
    const parts: string[] = []

    if (hasAny(e.epsUpLast30Days, e.epsDownLast30Days)) {
        parts.push(`revisions 30d: ${e.epsUpLast30Days ?? 0} up / ${e.epsDownLast30Days ?? 0} down`)
    }

    if (hasAny(e.eps30DaysAgo, e.eps90DaysAgo)) {
        parts.push(
            `EPS est. trend: ${fmtNum(e.epsCurrent ?? e.epsAvg)} now vs ${fmtNum(e.eps30DaysAgo)} (30d ago) vs ${fmtNum(e.eps90DaysAgo)} (90d ago)`
        )
    }

    return parts.length > 0 ? ` | ${parts.join(' | ')}` : ''
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
            ...f.forwardEstimates.map((e) => {
                const analysts = e.analystCount != null ? ` | ${e.analystCount} analysts` : ''
                return `- ${e.period}: EPS est. ${fmtNum(e.epsAvg)} (growth ${fmtPct(e.epsGrowth)}) | Revenue est. ${fmtLarge(e.revenueAvg)} (growth ${fmtPct(e.revenueGrowth)})${analysts}${buildRevisionSuffix(e)}`
            }),
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

const TREND_LABELS: Record<StockTechnicals['trend'], string> = {
    'golden-cross': 'SMA50 above SMA200 (bullish regime)',
    'death-cross': 'SMA50 below SMA200 (bearish regime)',
    neutral: 'no clear SMA regime',
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
    const trendLabel = TREND_LABELS[t.trend]

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
            // No publisher tag: it would expose where the data comes from
            return `- ${n.headline}${date}${summary}`
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
        'Live market data: incorporate these insights into your analysis where relevant.\n',
    ]

    if (data.financials) {
        parts.push(buildFinancialsSection(data.financials), '')

        const positioning = buildPositioningSection(data.financials)
        if (positioning) parts.push(positioning, '')
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
