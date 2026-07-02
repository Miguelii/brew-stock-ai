import type { QuoteSummaryResult } from 'yahoo-finance2/modules/quoteSummary-iface'
import type { FundamentalsTimeSeriesResult } from 'yahoo-finance2/modules/fundamentalsTimeSeries'
import type {
    AnalystRatings,
    EarningsQuarter,
    ForwardEstimate,
    InsiderActivity,
    RevenueTrendPoint,
    StockFundamentals,
} from '@/types/ReportDTO'
import { toIso } from '@/lib/formatters'

// Forward-looking earningsTrend periods we surface (current/next quarter & year).
const FORWARD_PERIODS = new Set(['0q', '+1q', '0y', '+1y'])

const MAX_EARNINGS_QUARTERS = 4
const MAX_REVENUE_YEARS = 4

/**
 * Classify an insider transaction as a buy or sell from its free-text label.
 *
 * @param text - Yahoo's `transactionText` (e.g. "Sale at price ...", "Purchase ...").
 * @returns `'buy'`, `'sell'`, or `null` when the text matches neither pattern.
 */
const classifyTransaction = (text: string | undefined): 'buy' | 'sell' | null => {
    const t = (text ?? '').toLowerCase()
    if (/(sale|sell|sold|disposition)/.test(t)) return 'sell'
    if (/(buy|bought|purchase|acquisition|grant)/.test(t)) return 'buy'
    return null
}

/**
 * Map the most recent quarters of earnings history into EPS actual-vs-estimate
 * rows, keeping at most {@link MAX_EARNINGS_QUARTERS}.
 *
 * @param summary - A Yahoo `quoteSummary` result with the `earningsHistory` module.
 * @returns The recent earnings quarters (empty when the module is absent).
 */
const mapEarningsHistory = (summary: QuoteSummaryResult): EarningsQuarter[] =>
    (summary.earningsHistory?.history ?? []).slice(-MAX_EARNINGS_QUARTERS).map((h) => ({
        period: h.period,
        quarter: toIso(h.quarter),
        epsActual: h.epsActual ?? null,
        epsEstimate: h.epsEstimate ?? null,
        surprisePercent: h.surprisePercent ?? null,
    }))

/**
 * Map analyst consensus estimates for the forward-looking periods defined in
 * {@link FORWARD_PERIODS} (current/next quarter and year).
 *
 * @param summary - A Yahoo `quoteSummary` result with the `earningsTrend` module.
 * @returns The forward EPS/revenue estimates (empty when the module is absent).
 */
const mapForwardEstimates = (summary: QuoteSummaryResult): ForwardEstimate[] =>
    (summary.earningsTrend?.trend ?? [])
        .filter((t) => FORWARD_PERIODS.has(t.period))
        .map((t) => ({
            period: t.period,
            epsAvg: t.earningsEstimate?.avg ?? null,
            epsGrowth: t.earningsEstimate?.growth ?? null,
            revenueAvg: t.revenueEstimate?.avg ?? null,
            revenueGrowth: t.revenueEstimate?.growth ?? null,
        }))

/**
 * Map annual income-statement time series into a compact revenue/net-income
 * trend (most recent year first). Sourced from `fundamentalsTimeSeries` rather
 * than the deprecated `incomeStatementHistory` quoteSummary module, which Yahoo
 * has emptied for most tickers since late 2024.
 *
 * @param series - The `fundamentalsTimeSeries` rows (mixed statement types).
 * @returns Up to {@link MAX_REVENUE_YEARS} annual revenue/net-income points, newest first.
 */
export const mapRevenueTrend = (series: FundamentalsTimeSeriesResult[]): RevenueTrendPoint[] =>
    series
        .filter((s) => s.TYPE === 'FINANCIALS')
        .toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, MAX_REVENUE_YEARS)
        .map((s) => ({
            endDate: toIso(s.date),
            totalRevenue: s.totalRevenue ?? null,
            netIncome:
                s.netIncomeCommonStockholders ??
                s.netIncomeContinuousOperations ??
                s.netIncomeIncludingNoncontrollingInterests ??
                null,
        }))

/**
 * Extract the latest analyst rating distribution (strong buy → strong sell).
 *
 * @param summary - A Yahoo `quoteSummary` result with the `recommendationTrend` module.
 * @returns The most recent rating distribution, or `null` when unavailable.
 */
const mapAnalystRatings = (summary: QuoteSummaryResult): AnalystRatings | null => {
    const latest = summary.recommendationTrend?.trend?.[0]
    if (!latest) return null
    return {
        period: latest.period,
        strongBuy: latest.strongBuy,
        buy: latest.buy,
        hold: latest.hold,
        sell: latest.sell,
        strongSell: latest.strongSell,
    }
}

/**
 * Aggregate recent insider transactions into buy/sell counts and a net share
 * balance (buys positive, sells negative), classifying each by its text label.
 *
 * @param summary - A Yahoo `quoteSummary` result with the `insiderTransactions` module.
 * @returns The aggregated activity, or `null` when there are no classifiable transactions.
 */
const mapInsiders = (summary: QuoteSummaryResult): InsiderActivity | null => {
    const transactions = summary.insiderTransactions?.transactions ?? []
    if (transactions.length === 0) return null

    let buyCount = 0
    let sellCount = 0
    let netShares = 0
    for (const tx of transactions) {
        const kind = classifyTransaction(tx.transactionText)
        if (kind === 'buy') {
            buyCount += 1
            netShares += tx.shares ?? 0
        } else if (kind === 'sell') {
            sellCount += 1
            netShares -= tx.shares ?? 0
        }
    }

    if (buyCount === 0 && sellCount === 0) return null
    return { netShares, buyCount, sellCount }
}

/**
 * Assemble the compact `StockFundamentals` shape used by the analysis context.
 * The `quoteSummary` result (earnings, estimates, ratings, insiders) and the
 * revenue trend (`fundamentalsTimeSeries`) are fetched independently, so either
 * may be absent. Every field is guarded so a missing source yields an empty
 * list / null rather than throwing.
 *
 * @param summary - The `quoteSummary` result, or `null` when that fetch failed.
 * @param revenueTrend - The pre-mapped revenue trend (see {@link mapRevenueTrend}).
 * @returns The combined {@link StockFundamentals}.
 */
export function mapFundamentals(
    summary: QuoteSummaryResult | null,
    revenueTrend: RevenueTrendPoint[]
): StockFundamentals {
    return {
        earningsHistory: summary ? mapEarningsHistory(summary) : [],
        forwardEstimates: summary ? mapForwardEstimates(summary) : [],
        revenueTrend,
        analystRatings: summary ? mapAnalystRatings(summary) : null,
        insiders: summary ? mapInsiders(summary) : null,
    }
}
