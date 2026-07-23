import type {
    StockFinancials,
    StockFundamentals,
    StockReports,
    StockScores,
    StockSigDev,
} from '@/types/ReportDTO'

export type PricePoint = { date: number; close: number }

export type GetYahooDataResult = {
    scores: StockScores | null
    reports: StockReports[]
    sigDev: StockSigDev | null
    financials: StockFinancials | null
    fundamentals: StockFundamentals | null
}

export type YahooDataWithFallbackResult = {
    ticker: string
    data: GetYahooDataResult
    /** isFresh is true when at least one field came fresh from Yahoo */
    isFresh: boolean
} | null
