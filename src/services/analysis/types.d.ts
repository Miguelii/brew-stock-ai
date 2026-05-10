import type { StockReports, StockScores, StockSigDev } from '@/types/ReportDTO'

export type StockFinancials = {
    currentPrice: number | null
    marketCap: number | null
    trailingPE: number | null
    forwardPE: number | null
    priceToBook: number | null
    fiftyTwoWeekHigh: number | null
    fiftyTwoWeekLow: number | null
    beta: number | null
    debtToEquity: number | null
    revenueGrowth: number | null
    earningsGrowth: number | null
    freeCashflow: number | null
    operatingCashflow: number | null
    profitMargins: number | null
    operatingMargins: number | null
    returnOnEquity: number | null
    totalRevenue: number | null
    ebitda: number | null
    totalDebt: number | null
    enterpriseValue: number | null
    targetMeanPrice: number | null
    targetHighPrice: number | null
    targetLowPrice: number | null
    dividendYield: number | null
}

export type GetYahooDataResult = {
    scores: StockScores | null
    reports: StockReports[]
    sigDev: StockSigDev | null
    financials?: StockFinancials | null
}

export type YahooTtlResult = { ticker: string; data: GetYahooDataResult; isFresh: boolean } | null
