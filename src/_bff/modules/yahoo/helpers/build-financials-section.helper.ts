import type { StockFinancials } from '@/types/ReportDTO'
import {
    fmtLarge,
    fmtLargeCount,
    fmtNum,
    fmtPct,
    fmtPrice,
    signedPct1,
} from '@/_bff/core/utils/formatters.utils'
import { hasAny } from '@/_bff/modules/yahoo/helpers/utils.helper'

/**
 * Render the "Key Financial Indicators" block (valuation, quality, growth and
 * analyst targets) as Markdown bullet lines. Dividend yield is included only
 * when present.
 *
 * @param f - The financial snapshot.
 * @returns The Markdown section as a single string.
 */
export function buildFinancialsSection(f: StockFinancials): string {
    const lines = [
        '**Key Financial Indicators:**',
        `- Price: ${fmtPrice(f.currentPrice)} | 52w Range: ${fmtPrice(f.fiftyTwoWeekLow)}–${fmtPrice(f.fiftyTwoWeekHigh)} | Beta: ${fmtNum(f.beta)}`,
        `- Market Cap: ${fmtLarge(f.marketCap)} | Enterprise Value: ${fmtLarge(f.enterpriseValue)}`,
        `- P/E (TTM): ${fmtNum(f.trailingPE)} | Forward P/E: ${fmtNum(f.forwardPE)} | P/B: ${fmtNum(f.priceToBook)}`,
    ]

    if (hasAny(f.pegRatio, f.priceToSales, f.enterpriseToEbitda, f.enterpriseToRevenue)) {
        lines.push(
            `- PEG: ${fmtNum(f.pegRatio)} | P/S: ${fmtNum(f.priceToSales)} | EV/EBITDA: ${fmtNum(f.enterpriseToEbitda)} | EV/Revenue: ${fmtNum(f.enterpriseToRevenue)}`
        )
    }

    if (hasAny(f.trailingEps, f.forwardEps, f.bookValue)) {
        lines.push(
            `- EPS (TTM): ${fmtNum(f.trailingEps)} | Forward EPS: ${fmtNum(f.forwardEps)} | Book Value/Share: ${fmtNum(f.bookValue)}`
        )
    }

    lines.push(
        `- Revenue Growth (YoY): ${fmtPct(f.revenueGrowth)} | Earnings Growth: ${fmtPct(f.earningsGrowth)}`,
        `- Profit Margin: ${fmtPct(f.profitMargins)} | Operating Margin: ${fmtPct(f.operatingMargins)}`
    )

    if (hasAny(f.grossMargins, f.ebitdaMargins, f.returnOnAssets)) {
        lines.push(
            `- Gross Margin: ${fmtPct(f.grossMargins)} | EBITDA Margin: ${fmtPct(f.ebitdaMargins)} | ROA: ${fmtPct(f.returnOnAssets)}`
        )
    }

    lines.push(
        `- ROE: ${fmtPct(f.returnOnEquity)} | Debt-to-Equity: ${fmtNum(f.debtToEquity)}`,
        `- Free Cash Flow: ${fmtLarge(f.freeCashflow)} | Operating Cash Flow: ${fmtLarge(f.operatingCashflow)}`,
        `- EBITDA: ${fmtLarge(f.ebitda)} | Total Revenue: ${fmtLarge(f.totalRevenue)}`
    )

    if (hasAny(f.currentRatio, f.quickRatio, f.totalCash)) {
        lines.push(
            `- Current Ratio: ${fmtNum(f.currentRatio)} | Quick Ratio: ${fmtNum(f.quickRatio)} | Cash: ${fmtLarge(f.totalCash)} (${fmtNum(f.totalCashPerShare)}/share)`
        )
    }

    if (hasAny(f.revenuePerShare, f.netIncomeToCommon)) {
        lines.push(
            `- Revenue/Share: ${fmtNum(f.revenuePerShare)} | Net Income to Common: ${fmtLarge(f.netIncomeToCommon)}`
        )
    }

    if (f.dividendYield != null) {
        const payout = f.payoutRatio != null ? ` | Payout Ratio: ${fmtPct(f.payoutRatio)}` : ''
        lines.push(`- Dividend Yield: ${fmtPct(f.dividendYield)}${payout}`)
    }

    lines.push(
        `- Analyst Target: ${fmtPrice(f.targetLowPrice)} (low) / ${fmtPrice(f.targetMeanPrice)} (mean) / ${fmtPrice(f.targetHighPrice)} (high)`
    )

    if (hasAny(f.recommendationKey, f.recommendationMean, f.targetMedianPrice)) {
        const analysts =
            f.numberOfAnalystOpinions != null ? ` from ${f.numberOfAnalystOpinions} analysts` : ''
        lines.push(
            `- Analyst Consensus: ${f.recommendationKey ?? 'N/A'} (mean rating ${fmtNum(f.recommendationMean)}${analysts}, 1 = strong buy) | Median Target: ${fmtPrice(f.targetMedianPrice)}`
        )
    }

    return lines.join('\n')
}

/**
 * Render the market positioning block: one-year performance against the S&P 500, short
 * interest and the ownership split. Empty when none of it was captured.
 *
 * @param f - The financial snapshot.
 * @returns The Markdown section, or an empty string when there is nothing to show.
 */
export function buildPositioningSection(f: StockFinancials): string {
    const lines: string[] = []

    if (hasAny(f.fiftyTwoWeekChange, f.sp500FiftyTwoWeekChange)) {
        const relative =
            f.fiftyTwoWeekChange != null && f.sp500FiftyTwoWeekChange != null
                ? ` → ${signedPct1((f.fiftyTwoWeekChange - f.sp500FiftyTwoWeekChange) * 100)} vs the index`
                : ''
        lines.push(
            `- 1-year price change: ${fmtPct(f.fiftyTwoWeekChange)} | S&P 500: ${fmtPct(f.sp500FiftyTwoWeekChange)}${relative}`
        )
    }

    if (hasAny(f.shortPercentOfFloat, f.shortRatio)) {
        lines.push(
            `- Short interest: ${fmtPct(f.shortPercentOfFloat)} of float | Days to cover: ${fmtNum(f.shortRatio)}`
        )
    }

    if (hasAny(f.heldPercentInsiders, f.heldPercentInstitutions)) {
        lines.push(
            `- Ownership: insiders ${fmtPct(f.heldPercentInsiders)} | institutions ${fmtPct(f.heldPercentInstitutions)}`
        )
    }

    if (hasAny(f.sharesOutstanding, f.floatShares)) {
        lines.push(
            `- Shares outstanding: ${fmtLargeCount(f.sharesOutstanding)} | Float: ${fmtLargeCount(f.floatShares)}`
        )
    }

    if (lines.length === 0) return ''

    return ['**Market Positioning & Ownership:**', ...lines].join('\n')
}
