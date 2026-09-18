import type { QuoteSummaryResult } from 'yahoo-finance2/modules/quoteSummary-iface'
import type { StockFinancials } from '@/types/ReportDTO'

/**
 * Map the `financialData`, `summaryDetail` and `defaultKeyStatistics` quoteSummary modules
 * into the stored financial snapshot.
 *
 * @param summary - A Yahoo `quoteSummary` result with those three modules.
 * @returns The snapshot, with every missing field as null.
 */
export function mapFinancials(summary: QuoteSummaryResult): StockFinancials {
    const fd = summary.financialData
    const sd = summary.summaryDetail
    const ks = summary.defaultKeyStatistics

    return {
        currentPrice: fd?.currentPrice ?? null,
        marketCap: sd?.marketCap ?? null,
        trailingPE: sd?.trailingPE ?? null,
        forwardPE: sd?.forwardPE ?? null,
        priceToBook: ks?.priceToBook ?? null,
        fiftyTwoWeekHigh: sd?.fiftyTwoWeekHigh ?? null,
        fiftyTwoWeekLow: sd?.fiftyTwoWeekLow ?? null,
        beta: sd?.beta ?? null,
        debtToEquity: fd?.debtToEquity ?? null,
        revenueGrowth: fd?.revenueGrowth ?? null,
        earningsGrowth: fd?.earningsGrowth ?? null,
        freeCashflow: fd?.freeCashflow ?? null,
        operatingCashflow: fd?.operatingCashflow ?? null,
        profitMargins: fd?.profitMargins ?? null,
        operatingMargins: fd?.operatingMargins ?? null,
        returnOnEquity: fd?.returnOnEquity ?? null,
        totalRevenue: fd?.totalRevenue ?? null,
        ebitda: fd?.ebitda ?? null,
        totalDebt: fd?.totalDebt ?? null,
        enterpriseValue: ks?.enterpriseValue ?? null,
        targetMeanPrice: fd?.targetMeanPrice ?? null,
        targetHighPrice: fd?.targetHighPrice ?? null,
        targetLowPrice: fd?.targetLowPrice ?? null,
        dividendYield: sd?.dividendYield ?? null,

        pegRatio: ks?.pegRatio ?? null,
        enterpriseToEbitda: ks?.enterpriseToEbitda ?? null,
        enterpriseToRevenue: ks?.enterpriseToRevenue ?? null,
        priceToSales: sd?.priceToSalesTrailing12Months ?? null,
        trailingEps: ks?.trailingEps ?? null,
        forwardEps: ks?.forwardEps ?? null,
        bookValue: ks?.bookValue ?? null,
        payoutRatio: sd?.payoutRatio ?? null,

        grossMargins: fd?.grossMargins ?? null,
        ebitdaMargins: fd?.ebitdaMargins ?? null,
        returnOnAssets: fd?.returnOnAssets ?? null,
        currentRatio: fd?.currentRatio ?? null,
        quickRatio: fd?.quickRatio ?? null,
        totalCash: fd?.totalCash ?? null,
        totalCashPerShare: fd?.totalCashPerShare ?? null,
        revenuePerShare: fd?.revenuePerShare ?? null,
        netIncomeToCommon: ks?.netIncomeToCommon ?? null,

        fiftyTwoWeekChange: ks?.['52WeekChange'] ?? null,
        sp500FiftyTwoWeekChange: ks?.SandP52WeekChange ?? null,

        sharesOutstanding: ks?.sharesOutstanding ?? null,
        floatShares: ks?.floatShares ?? null,
        shortPercentOfFloat: ks?.shortPercentOfFloat ?? null,
        shortRatio: ks?.shortRatio ?? null,
        heldPercentInsiders: ks?.heldPercentInsiders ?? null,
        heldPercentInstitutions: ks?.heldPercentInstitutions ?? null,

        recommendationKey: fd?.recommendationKey ?? null,
        recommendationMean: fd?.recommendationMean ?? null,
        numberOfAnalystOpinions: fd?.numberOfAnalystOpinions ?? null,
        targetMedianPrice: fd?.targetMedianPrice ?? null,
    }
}
